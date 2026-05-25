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
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
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
