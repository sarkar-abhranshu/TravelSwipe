import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { Text, View, Button, StyleSheet } from "react-native";
import { useDestinations } from "@/hooks/useDestinations";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const { destinations, loading, loadingMore, hasMore, error, loadMore } =
    useDestinations();
  console.log(destinations);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome, {displayName}!</Text>

        {loading && (
          <Text style={styles.loadingText}>Loading initial data...</Text>
        )}

        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        <Text style={styles.countText}>
          Destinations loaded: {destinations.length}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title={loadingMore ? "Loading more..." : "Load More"}
            onPress={loadMore}
            disabled={loadingMore || !hasMore}
          />
        </View>

        {!hasMore && (
          <Text style={styles.noMoreText}>No more destinations to load</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  countText: {
    fontSize: 18,
    marginVertical: 20,
    color: "#333",
  },
  buttonContainer: {
    marginVertical: 10,
  },
  noMoreText: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
});
