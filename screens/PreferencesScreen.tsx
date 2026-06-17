import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { RadioButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";

export default function PreferencesScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    locationGranted: false,
    latitude: null as number | null,
    longitude: null as number | null,
    distance: "", // "close" or "far"
    duration: "", // "short" or "long"
  });

  const [loading, setLoading] = useState(false);

  const handleLocation = async () => {
    console.log("🔍 Requesting location permission...");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("📍 Permission status:", status);

      if (status === "granted") {
        console.log("✅ Permission granted, getting location...");
        const location = await Location.getCurrentPositionAsync({});
        console.log("📍 Location:", location.coords);

        setFormData((prev) => ({
          ...prev,
          locationGranted: true,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));

        Alert.alert("Success", "Location access granted!");
      } else {
        console.log("❌ Permission denied");
        Alert.alert("Permission Denied", "Location permission is required.");
      }
    } catch (error) {
      console.error("❌ Location error:", error);
      Alert.alert("Error", "Failed to get location");
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!user) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    if (!formData.locationGranted) {
      Alert.alert("Required", "Please grant location permission");
      return;
    }

    if (!formData.distance) {
      Alert.alert("Required", "Please select a distance preference");
      return;
    }

    if (!formData.duration) {
      Alert.alert("Required", "Please select a trip duration preference");
      return;
    }

    try {
      setLoading(true);
      console.log("💾 Saving preferences for user:", user.id);

      // Map form data to database schema
      const preferencesData = {
        user_id: user.id,
        location_when_in_use_permission: formData.locationGranted,
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        close_dest: formData.distance === "close", // true if close, false if far
        trip_duration: formData.duration === "short" ? 3 : 7, // 3 days for short, 7 for long
      };

      console.log("📝 Preferences data:", preferencesData);

      // Insert or update preferences
      const { error: prefError } = await supabase
        .from("preferences")
        .upsert(preferencesData, {
          onConflict: "user_id",
        });

      if (prefError) {
        console.error("❌ Error saving preferences:", prefError);
        Alert.alert(
          "Error",
          `Failed to save preferences: ${prefError.message}`,
        );
        return;
      }

      console.log("✅ Preferences saved successfully");

      // Update preferences_completed flag in profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ preferences_completed: true })
        .eq("user_id", user.id);

      if (profileError) {
        console.error("❌ Error updating profile:", profileError);
        Alert.alert("Error", "Failed to update profile");
        return;
      }

      console.log("✅ Profile updated with preferences_completed flag");

      Alert.alert("Success", "Preferences saved!", [
        {
          text: "OK",
          onPress: () => router.push("/home"),
        },
      ]);
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Preferences</Text>
            <Text style={styles.subtitle}>Tell us about your travel style</Text>

            <View style={styles.form}>
              {/* Location Permission */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location Permission</Text>
                <TouchableOpacity
                  style={[
                    styles.locationButton,
                    formData.locationGranted && styles.locationButtonGranted,
                  ]}
                  onPress={handleLocation}
                  activeOpacity={0.8}
                  disabled={formData.locationGranted}
                >
                  <Text
                    style={[
                      styles.locationButtonText,
                      formData.locationGranted &&
                        styles.locationButtonTextGranted,
                    ]}
                  >
                    {formData.locationGranted
                      ? "✓ Location Granted"
                      : "Grant Location Access"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Distance Preference */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Do you prefer close-by or far-off destinations?
                </Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, distance: "close" }))
                    }
                  >
                    <RadioButton
                      value="close"
                      status={
                        formData.distance === "close" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, distance: "close" }))
                      }
                      color="#2563EB"
                    />
                    <Text style={styles.radioLabel}>Close-by destinations</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, distance: "far" }))
                    }
                  >
                    <RadioButton
                      value="far"
                      status={
                        formData.distance === "far" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, distance: "far" }))
                      }
                      color="#2563EB"
                    />
                    <Text style={styles.radioLabel}>Far-off destinations</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Duration Preference */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  How long do you like to travel?
                </Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, duration: "short" }))
                    }
                  >
                    <RadioButton
                      value="short"
                      status={
                        formData.duration === "short" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, duration: "short" }))
                      }
                      color="#2563EB"
                    />
                    <Text style={styles.radioLabel}>
                      Short trips (1-3 days)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, duration: "long" }))
                    }
                  >
                    <RadioButton
                      value="long"
                      status={
                        formData.duration === "long" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, duration: "long" }))
                      }
                      color="#2563EB"
                    />
                    <Text style={styles.radioLabel}>Long trips (4+ days)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Saving..." : "Complete Setup"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },
  locationButton: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2563EB",
  },
  locationButtonGranted: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },
  locationButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },
  locationButtonTextGranted: {
    color: "#16A34A",
  },
  radioGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    padding: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  radioLabel: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
