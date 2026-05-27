import React, { useState } from "react";
import { View } from "react-native";
import AuthForm from "../components/AuthForm";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const SignupScreen = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError("");
      await signup(email, password);
      router.push("/home");
    } catch (err: any) {
      setError("Signup error in screen:", err);
      const errorMessage =
        err.message ||
        err.error_description ||
        "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthForm
        mode="signup"
        onSubmit={handleSignup}
        onSwitchMode={() => router.push("/login")}
        error={error}
        loading={loading}
      />
    </View>
  );
};

export default SignupScreen;
