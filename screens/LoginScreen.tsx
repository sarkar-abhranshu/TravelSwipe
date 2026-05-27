import React, { useState } from "react";
import { View } from "react-native";
import AuthForm from "../components/AuthForm";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await login(email, password);
      setIsLoading(false);
      router.push("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        onSwitchMode={() => router.push("/signup")}
        error={error}
        loading={loading}
      />
    </View>
  );
};

export default LoginScreen;
