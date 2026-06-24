import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import DestinationCard from "@/components/DestinationCard";

export default function Home() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  const displayName = profile?.username || user.user_metadata.name || "User";
  const onboarding = profile?.onboarding_completed;
  const preferences = profile?.preferences_completed;
  if (!onboarding) {
    return <Redirect href="/onboarding" />;
  }
  if (!preferences) {
    return <Redirect href="/preferences" />;
  }
  return (
    <View>
      <Text>Welcome, {displayName}!</Text>
      <DestinationCard title="Destination 1" />
    </View>
  );
}
