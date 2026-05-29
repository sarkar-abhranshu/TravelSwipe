import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { Text } from "react-native";

export default function Home() {
  const { user, isLoading } = useAuth();

  console.log("User object:", JSON.stringify(user, null, 2));

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Text>Welcome, {user.user_metadata.name}!</Text>;
}
