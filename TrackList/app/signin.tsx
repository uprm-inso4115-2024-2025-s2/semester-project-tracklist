import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Signed in successfully!");
      router.replace("/menu");
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Sign In Error", errorMessage);
    }
  };

  // For web, skip wrapping in TouchableWithoutFeedback
  const ContainerWrapper =
    Platform.OS === "web" ? React.Fragment : TouchableWithoutFeedback;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ContainerWrapper {...(Platform.OS !== "web" && { onPress: Keyboard.dismiss })}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access your account!
          </Text>

          <InputField
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            inputType="email"
          />

          <InputField
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            inputType="password"
          />

          <View style={styles.buttonContainer}>
            <CustomButton text="Sign In" onPress={handleSignIn} />
          </View>

          <Text style={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Text style={styles.link} onPress={() => router.replace("/signup")}>
              Sign Up
            </Text>
          </Text>
        </ScrollView>
      </ContainerWrapper>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  footerText: {
    marginTop: 15,
    textAlign: "center",
  },
  link: {
    color: "#28a745",
    fontWeight: "bold",
  },
});
