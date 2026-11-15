import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Disable iOS swipe-back on home — it conflicts with the card swipe */}
        <Stack.Screen
          name="home"
          options={{ gestureEnabled: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
