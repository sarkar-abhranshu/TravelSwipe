import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Button } from "react-native-elements";
import DropShadow from "react-native-drop-shadow";

const LoginScreen = () => {
  return (
    <View>
      <Text style={styles.welcome}>Welcome to TravelSwipe!</Text>
      <Text style={styles.login}>Login</Text>
      <Text style={styles.label}>Email</Text>
      <DropShadow style={styles.input}>
        <TextInput placeholder="Enter your email" />
      </DropShadow>
      <Text style={styles.label}>Password</Text>
      <DropShadow style={styles.input}>
        <TextInput placeholder="Enter your password" secureTextEntry />
      </DropShadow>
      <DropShadow style={styles.button}>
        <Button
          title="Login"
          buttonStyle={styles.buttonText}
          onPress={() => console.log("Login Pressed")}
        />
      </DropShadow>
      <Text style={styles.or}>
        {"-".repeat(15)} OR {"-".repeat(15)}
      </Text>
      <DropShadow style={styles.button}>
        <TouchableOpacity
          style={styles.oauth}
          onPress={() => console.log("OAuth Pressed")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/google.jpg")}
              style={{ width: 24, height: 24, marginRight: 20, marginLeft: 10 }}
            />
            <Text style={styles.buttonTextOauth}>Login with Google</Text>
          </View>
        </TouchableOpacity>
      </DropShadow>
      <TouchableOpacity
        style={styles.signUp}
        onPress={() => console.log("Signup Pressed")}
      >
        <Text style={styles.signupText}>New to TravelSwipe? Sign Up!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  welcome: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 100,
    marginLeft: 60,
  },
  login: {
    fontSize: 20,
    marginTop: 20,
    marginLeft: 60,
  },
  input: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: Dimensions.get("window").width - 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 60,
  },
  button: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 60,
    padding: 10,
    width: Dimensions.get("window").width - 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  or: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 75,
  },
  oauth: {
    padding: 10,
    width: Dimensions.get("window").width - 120,
    backgroundColor: "#fff",
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  buttonTextOauth: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  signUp: {
    marginTop: 60,
    marginLeft: 10,
  },
  signupText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1964A6",
  },
});

export default LoginScreen;
