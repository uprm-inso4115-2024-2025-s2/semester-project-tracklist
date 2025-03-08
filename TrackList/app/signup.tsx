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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const userIcon = require("../assets/images/user-icon.png");

  const validatePassword = (password: string) => {
    let errorMessages = [];
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[-_@#$^*+.!=%()]/.test(password);
    const length = password.length >= 8 && password.length <= 30;

    if (!length)
      errorMessages.push("Password must be between 8 and 30 characters long.");
    if (!upperCase)
      errorMessages.push("Password must contain at least one uppercase letter.");
    if (!lowerCase)
      errorMessages.push("Password must contain at least one lowercase letter.");
    if (!number)
      errorMessages.push("Password must contain at least one number.");
    if (!specialChar)
      errorMessages.push("Password must contain at least one special character.");

    if (errorMessages.length > 0) {
      Alert.alert("Password Error", errorMessages.join("\n"));
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!fullName || !email || !dateOfBirth || !phoneNumber || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        uid: user.uid,
        profilePicture: Image.resolveAssetSource(userIcon).uri,
        bio: "Hello! I'm new here.",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("User registered:", user.uid);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/menu");
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Signup Error", errorMessage);
    }
  };

  const ContainerWrapper =
    Platform.OS === "web" ? React.Fragment : TouchableWithoutFeedback;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ContainerWrapper {...(Platform.OS !== "web" && { onPress: Keyboard.dismiss })}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Sign up</Text>
          <Text style={styles.subtitle}>Create an account to continue!</Text>

          <InputField
            label="Full Name"
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <InputField
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            inputType="email"
          />

          <InputField
            label="Date of Birth"
            placeholder="DD/MM/YYYY"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numeric"
          />

          <InputField
            label="Phone Number"
            placeholder="(XXX) XXX-XXXX"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <InputField
            label="Set Password"
            placeholder="*******"
            value={password}
            onChangeText={setPassword}
            inputType="password"
          />

          <View style={styles.buttonContainer}>
            <CustomButton text="Register" onPress={handleRegister} />
          </View>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => router.replace("/signin")}
            >
              Login
            </Text>
          </Text>
        </ScrollView>
      </ContainerWrapper>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
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
