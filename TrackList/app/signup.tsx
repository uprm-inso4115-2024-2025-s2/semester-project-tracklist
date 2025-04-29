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
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    dob: "",
    password: "",
  });

  const [humanAnswer, setHumanAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const [challenge, setChallenge] = useState({
    a: null,
    b: null,
    answer: null,
  });

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  const generateNewCaptcha = () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    setChallenge({ a, b, answer: a + b });
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePhone = (phone) => /^\+\d{10,15}$/.test(phone); // expect +1234567890 format
  const validateDOB = (dob) => /^\d{2}\/\d{2}\/\d{4}$/.test(dob);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleRegister = async () => {
    let newErrors = {};
    if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!validatePhone(phone))
      newErrors.phone = "Phone must be in +1234567890 format";
    if (!validateDOB(dob))
      newErrors.dob = "Date of birth must be in DD/MM/YYYY format";
    if (!validatePassword(password))
      newErrors.password =
        "Password must be 8+ chars, 1 uppercase, 1 number, 1 special character";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (parseInt(humanAnswer) !== challenge.answer) {
      setCaptchaError("Incorrect answer. Please try again.");
      generateNewCaptcha(); // refresh new captcha
      setHumanAnswer(""); // clear wrong answer
      return;
    }
    setCaptchaError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        phone,
        dob,
        uid: user.uid,
      });

      Alert.alert(
        "Verify Your Email",
        "A verification email has been sent. Please verify your email before continuing."
      );

      router.push("(tabs)/menu"); // or wherever you want after signup
    } catch (error) {
      Alert.alert("Error", error.message);
    }
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
            value={email}
            onChangeText={setEmail}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <Text style={styles.label}>Phone Number (+1234567890)</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          {errors.phone ? (
            <Text style={styles.errorText}>{errors.phone}</Text>
          ) : null}

          <Text style={styles.label}>Date of Birth (DD/MM/YYYY)</Text>
          <TextInput
            style={styles.input}
            placeholder="DOB"
            value={dob}
            onChangeText={setDob}
            keyboardType="numeric"
          />
          {errors.dob ? (
            <Text style={styles.errorText}>{errors.dob}</Text>
          ) : null}

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
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {challenge.a !== null && (
            <>
              <Text style={styles.label}>
                Are you human? What is {challenge.a} + {challenge.b}?
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Answer"
                value={humanAnswer}
                onChangeText={setHumanAnswer}
                keyboardType="numeric"
              />
              {captchaError ? (
                <Text style={styles.errorText}>{captchaError}</Text>
              ) : null}
            </>
          )}

          <View style={styles.buttonContainer}>
            <CustomButton text="Register" onPress={handleRegister} />
          </View>
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
  errorText: { color: "red", fontSize: 12, marginTop: 5 },
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
});
