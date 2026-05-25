import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-elements";

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

  return (
    <View>
      <Text style={styles.welcome}>Welcome to TravelSwipe!</Text>
      <Text style={styles.login}>{mode === "login" ? "Login" : "Sign Up"}</Text>
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputShadow}>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputShadow}>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      {mode === "signup" && <Text style={styles.label}>Confirm Password</Text>}
      {mode === "signup" && (
        <View style={styles.inputShadow}>
          <TextInput
            placeholder="Confirm your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      )}
      <View style={styles.buttonShadow}>
        <Button
          title={mode === "login" ? "Login" : "Sign Up"}
          buttonStyle={styles.buttonText}
          onPress={() => onSubmit(email, password)}
        />
      </View>
      <Text style={styles.or}>
        {"-".repeat(15)} OR {"-".repeat(15)}
      </Text>
      <View style={styles.buttonShadow}>
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
      </View>
      <TouchableOpacity style={styles.signUp} onPress={onSwitchMode}>
        <Text style={styles.signupText}>
          {mode === "login"
            ? "New to TravelSwipe? Sign Up!"
            : "Already have an Account? Login!"}
        </Text>
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
  inputShadow: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: Dimensions.get("window").width - 120,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 60,
  },
  buttonShadow: {
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
    elevation: 10,
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
    marginTop: -50,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1964A6",
  },
});

export default AuthForm;
