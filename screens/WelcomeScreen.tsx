import React from "react";
import { Text, StyleSheet, View, Image, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const imageHeight = screenHeight * 0.5;
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <Image
        style={styles.image}
        resizeMode="cover"
        height={imageHeight}
        source={require("../assets/mountain.jpg")}
      />
      <View style={styles.container}>
        <View style={styles.contentArea}>
          <Text style={styles.title}>Welcome to TravelSwipe!</Text>
          <Text style={styles.content}>
            TravelSwipe is a simple and fun to use travel destinations
            recommender and travel plan suggester.{"\n"}
            Swipe left to right to see more destinations.{"\n"}
            Get Travel Itinerary for selected destinations.{"\n"}
            The more you swipe, the better the recommendations get.
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={styles.button}
          title="Click Here to Continue"
          onPress={() => router.push("/login")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    width: "100%",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    padding: 20,
    marginTop: -20,
    justifyContent: "space-between",
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    marginVertical: 15,
    borderRadius: 30,
  },
});

export default WelcomeScreen;
