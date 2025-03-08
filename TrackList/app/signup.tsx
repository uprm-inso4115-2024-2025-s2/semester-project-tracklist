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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Updated path

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "631878773843-6plru7v2kh7hv4ajeqltc9ac5jd1fimf.apps.googleusercontent.com",
    iosClientId: "1:631878773843:ios:7af497ae0a00c47eb26aa6",
    androidClientId: "1:631878773843:android:166157b5ac4bc195b26aa6",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          Alert.alert("Welcome!", `Signed in as ${userCredential.user.email}`);
          router.push("/menu");
        })
        .catch((error) => Alert.alert("Authentication Error", error.message));
    }
  }, [response]);

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
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Sign up</Text>
          <Text style={styles.subtitle}>Create an account to continue!</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Full Name" />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput style={styles.input} placeholder="DD/MM/YYYY" keyboardType="numeric" />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} placeholder="(XXX) XXX-XXXX" keyboardType="phone-pad" />

          <Text style={styles.label}>Set Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="*******"
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton text="Register" onPress={handleRegister} />
            <TouchableOpacity
              style={styles.googleButton}
              disabled={!request}
              onPress={() => promptAsync()}
            >
              <Ionicons name="logo-google" size={24} color="#fff" />
              <Text style={styles.googleButtonText}>Sign Up with Google</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.loginLink} onPress={() => router.push("/signin")}>
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
  buttonContainer: {
    marginTop: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4437",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
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