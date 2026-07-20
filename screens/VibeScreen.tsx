import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import VibeCard from '../components/VibeCard';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

const VibeScreen: React.FC = () => {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const handleSubmit = async () => {
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
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <VibeCard />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VibeScreen;
