import React from 'react';
import { View, Text, ImageBackground, Dimensions, StyleSheet } from 'react-native';
import { VIBES }  from '../constants/vibes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VibeCardProps {
  id: string;
}

export default function VibeCard({ id }: VibeCardProps) {
  const vibe = VIBES.find((v) => v.id === id);

  if (!vibe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vibe not found</Text>
      </View>
    )
  }

  return (
    <ImageBackground source={{ uri: vibe.imageUrl }} style={styles.container} resizeMode='cover'>
      <View style={styles.overlay} />
      <View style={styles.textBlock}>
        <Text style={styles.emoji}>{vibe.emoji}</Text>
        <Text style={styles.name}>{vibe.name}</Text>
        <Text style={styles.description}>{vibe.description}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 59,
    justifyContent: 'flex-start',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  textBlock: {
    marginTop: 100,
    paddingHorizontal: 32,
    alignItems: 'center',
    zIndex: 1,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});
