import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Animated, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import VibeCard from '../components/VibeCard';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';
import { VIBES, resolveTagsFromVibes } from '@/constants/vibes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VibeScreen: React.FC = () => {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [showDialog, setShowDialog] = useState(true); //set to true because initially showing till turned off
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [lastTap, setLastTap] = useState<number | null>(null);

  const position = useRef(new Animated.ValueXY()).current;

  const updateIndex = (newIndex: number) => {
    currentIndexRef.current = newIndex;
    setCurrentIndex(newIndex);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120 && currentIndexRef.current > 0) {
          swipeCard('right');
        } else if (gesture.dx < -120 && currentIndexRef.current < VIBES.length - 1) {
          swipeCard('left');
        } else {
          // Return to center posiiton
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const swipeCard = (direction: 'left' | 'right') => {
    const idx = currentIndexRef.current;
    let newIndex = idx;

      if (direction === 'left') {
        // Swiping left = going to next card
        newIndex = idx + 1;
        if (newIndex >= VIBES.length) {
          // Can't go forward
          Animated.sequence([
            Animated.timing(position, {
              toValue: { x: -50, y: 0 },
              duration: 100,
              useNativeDriver: false,
            }),
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            })
          ]).start();
          return;
        }
      } else {
        // Swiping right = going to previous card
        newIndex = idx - 1;
        if (newIndex < 0) {
          // Can't go backward
          Animated.sequence([
            Animated.timing(position, {
              toValue: { x: 50, y: 0 },
              duration: 100,
              useNativeDriver: false,
            }),
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            })
          ]).start();
          return;
        }
      }

      // Animate the card off screen
      const toValue = direction === 'left' ? -SCREEN_WIDTH - 100 : SCREEN_WIDTH + 100;

      Animated.timing(position, {
        toValue: { x: toValue, y: 0 },
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        // Update to the new index
        updateIndex(newIndex);
        // Reset position for next card
        position.setValue({ x: 0, y: 0 });
      });
   };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      handleDoubleTap();
      setLastTap(null);
    } else {
      setLastTap(now);
    }
  };

  const handleDoubleTap = () => {
    const currentVibeId = VIBES[currentIndex].id;

    if (selectedVibes.includes(currentVibeId)) {
      // Deselect
      setSelectedVibes(selectedVibes.filter(id => id !== currentVibeId));
    } else {
      // Select
      setSelectedVibes([...selectedVibes, currentVibeId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedVibes.length === 0) {
      Alert.alert('Oops!', "Please select at least one vibe before submitting.");
      return;
    }

    const tags = resolveTagsFromVibes(selectedVibes);

    const { error: prefError } = await supabase.from('preferences').update({ preferred_tags: tags }).eq("user_id", user.id);

    if (prefError) {
      console.error("❌ Error updating preferences:", prefError);
      Alert.alert("Error", "Failed to update preferences");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ preferences_completed: true })
      .eq("user_id", user.id);

    if (profileError) {
      console.error("❌ Error updating profile:", profileError);
      Alert.alert("Error", "Failed to update profile");
      return;
    }

    await refreshProfile();
    router.replace('/home');
  };

  const renderDialog = () => (
    <Modal visible={showDialog} transparent={true} animationType='fade' onRequestClose={() => setShowDialog(false)}>
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>How to Choose Your Vibes</Text>
          <Text style={styles.dialogText}>
            • <Text style={styles.bold}>Double tap</Text> a card to select it
          </Text>
          <Text style={styles.dialogText}>
            • <Text style={styles.bold}>Swipe left/right</Text> to browse other vibes
          </Text>
          <Text style={styles.dialogText}>
            • Select as many vibes as you like
          </Text>
          <TouchableOpacity style={styles.dialogButton} onPress={() => setShowDialog(false)}>
            <Text style={styles.dialogButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderIndicators = () => (
    <View style={styles.indicatorContainer}>
      {VIBES.map((vibe, index) => {
        const isSelected = selectedVibes.includes(vibe.id);
        const isCurrent = index === currentIndex;
        return (
          <View
            key={vibe.id}
            style={[
              styles.indicator,
              isCurrent && styles.indicatorCurrent,
              isSelected && styles.indicatorSelected
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderDialog()}

      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              { translateX: position.x },
              {
                rotate: position.x.interpolate({
                  inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                  outputRange: ['-10deg', '0deg', '10deg'],
                })
              }
            ]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={{ flex: 1 }} onTouchEnd={handleTap}>
          <VibeCard id={VIBES[currentIndex].id} />
        </View>
      </Animated.View>

      <View style={styles.bottomSection}>
        {renderIndicators()}

        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedVibes.length === 0 && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 60,
  },
  cardContainer: {
    flex: 1,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 20,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogBox: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  dialogText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  dialogButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  dialogButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorCurrent: {
    backgroundColor: '#60A5FA',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  indicatorSelected: {
    backgroundColor: '#4ADE80',

  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    backgroundColor: '#60A5FA',
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(96, 165, 250, 0.5)',
  },
});

export default VibeScreen;
