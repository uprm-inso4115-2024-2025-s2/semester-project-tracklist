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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", phone: "", dob: "", password: "" });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\(\d{3}\) \d{3}-\d{4}|\d{10}|(\d{3}-){2}\d{4})$/;
    return phoneRegex.test(phone);
  };

  const validateDOB = (dob) => {
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dobRegex.test(dob);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    let newErrors = {};
    if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!validatePhone(phone)) newErrors.phone = "Phone must be in (XXX) XXX-XXXX format";
    if (!validateDOB(dob)) newErrors.dob = "Date of birth must be in DD/MM/YYYY format";
    if (!validatePassword(password)) newErrors.password = "Password must be 8+ chars, 1 uppercase, 1 number, 1 special character";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        phone: phone,
        dob: dob,
        uid: user.uid,
      });
      
      Alert.alert("Success", "Sign-up complete!");
      router.push("(tabs)/menu");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Sign up</Text>
          <Text style={styles.subtitle}>Create an account to continue!</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} placeholder="(XXX) XXX-XXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={dob} onChangeText={setDob} keyboardType="numeric" />
          {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}

          <Text style={styles.label}>Set Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput style={styles.passwordInput} placeholder="*******" secureTextEntry={!passwordVisible} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <View style={styles.buttonContainer}> 
            <CustomButton text="Register" onPress={handleRegister} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "500", marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginTop: 5 },
  errorText: { color: "red", fontSize: 12, marginTop: 5 },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginTop: 5 },
  passwordInput: { flex: 1 },
  buttonContainer: { marginTop: 20 },
});