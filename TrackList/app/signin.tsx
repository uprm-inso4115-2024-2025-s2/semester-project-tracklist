import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    // Placeholder for authentication logic
    Alert.alert("Pseudo Sign-In", "This is a placeholder. No login is actually performed.");
    router.push("/menu");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Log in to your account!</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="*******"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Forgot Password Link */}
        <Text
          style={styles.forgotPassword}
          onPress={() => router.push("/resetpassword" as any)}
        >
          Forgot Password?
        </Text>

        <View style={styles.buttonContainer}>
          <CustomButton text="Login" onPress={handleLogin} />
        </View>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text style={styles.loginLink} onPress={() => router.push("/signup")}>
            Sign Up
          </Text>
        </Text>
      </ScrollView>
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
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
  },
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
  passwordInput: {
    flex: 1,
  },
  forgotPassword: {
    marginTop: 10,
    color: "#007bff",
    textAlign: "right",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 20,
  },
  footerText: {
    marginTop: 15,
    textAlign: "center",
  },
  loginLink: {
    color: "#28a745",
    fontWeight: "bold",
  },
});
