import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
WebBrowser.maybeCompleteAuthSession();
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
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleRegister = () => {
    Alert.alert("Pseudo Sign-Up", "This is a placeholder. No account is actually created.");
    router.push("/menu");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Sign up</Text>
          <Text style={styles.subtitle}>Create an account to continue!</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            keyboardType="numeric"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="(XXX) XXX-XXXX"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Text style={styles.label}>Set Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="*******"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton text="Register" onPress={handleRegister} />
          </View>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => router.replace("/signin")}
            >
              Login
            </Text>
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
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
  label: { fontSize: 14, fontWeight: "500", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  passwordInput: { flex: 1 },
  buttonContainer: { marginTop: 20 },
  footerText: { marginTop: 15, textAlign: "center" },
  loginLink: { color: "#28a745", fontWeight: "bold" },
});