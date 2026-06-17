import { supabase } from "@/utils/supabase";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const OnboardingScreen = () => {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to continue.");
      return;
    }

    try {
      setLoading(true);

      // Update onboarding_completed flag
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating onboarding status:", error);
        Alert.alert("Error", "Failed to update onboarding status");
        return;
      }

      console.log("✅ Onboarding completed for user:", user.id);

      await refreshProfile();
      router.push("/preferences");
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.description}>
        Let's get you set up with a quick onboarding process
      </Text>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Continue to Preferences"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#6B7280",
  },
});

export default OnboardingScreen;
