import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (email: string, password: string) => void;
  onSwitchMode: () => void;
  error?: string;
  loading?: boolean;
}

const AuthForm = ({
  mode,
  onSubmit,
  onSwitchMode,
  error,
  loading,
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    setValidationError("");
    if (!email || !password) {
      setValidationError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    onSubmit(email, password);
  };

  const displayError = validationError || error;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>TravelSwipe</Text>
          <Text style={styles.tagline}>Discover your next adventure</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.modeTitle}>
            {mode === "login" ? "Welcome back 👋" : "Create account ✈️"}
          </Text>
          <Text style={styles.modeSubtitle}>
            {mode === "login"
              ? "Sign in to continue exploring"
              : "Join TravelSwipe today"}
          </Text>

          {/* Error Banner */}
          {displayError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {displayError}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password (signup only) */}
          {mode === "signup" && (
            <>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          )}

          {/* Primary Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              loading && styles.primaryButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {mode === "login" ? "Login" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google OAuth */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => console.log("OAuth Pressed")}
            activeOpacity={0.85}
          >
            <Image
              source={require("../assets/google.jpg")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Switch Mode */}
        <TouchableOpacity onPress={onSwitchMode} style={styles.switchMode}>
          <Text style={styles.switchModeText}>
            {mode === "login"
              ? "New to TravelSwipe? "
              : "Already have an account? "}
            <Text style={styles.switchModeLink}>
              {mode === "login" ? "Sign Up" : "Login"}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#f0f4f8",
    paddingBottom: 40,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: 28,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a2e",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  modeSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: "#fff0f0",
    borderWidth: 1,
    borderColor: "#ffcccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#cc0000",
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#f8f9fb",
    borderWidth: 1,
    borderColor: "#e0e4ea",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1a1a2e",
  },
  primaryButton: {
    backgroundColor: "#1877F2",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#1877F2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e8eaed",
  },
  dividerText: {
    fontSize: 13,
    color: "#aaa",
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e0e4ea",
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: "#fff",
    gap: 10,
  },
  googleIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  switchMode: {
    marginTop: 24,
    alignItems: "center",
  },
  switchModeText: {
    fontSize: 14,
    color: "#666",
  },
  switchModeLink: {
    color: "#1877F2",
    fontWeight: "700",
  },
});

export default AuthForm;
