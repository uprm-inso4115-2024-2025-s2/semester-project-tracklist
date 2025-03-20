import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const handleResetPassword = () => {
    setSuccessMessage("Password reset successful! Redirecting...");
    setTimeout(() => {
      router.push("/signin");
    }, 2000);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.message}>Enter a new password</Text>
      <Text style={styles.label1}>New password</Text>
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
      <Text style={styles.label2}>Confirm new password</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
    },
    title: {
      fontSize: 34,
      fontWeight: "bold",
      color: "#333",
    },
    message: { 
        fontSize: 18,
        color: "black",
        padding: 20,
    },
    label1: { 
        fontSize: 16,
        color: "black",
        paddingTop: 25,
        left: -90,
    },
    label2: { 
        fontSize: 16,
        color: "black",
        paddingTop: 25,
        left: -60,
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
        width: 250,
    },
    button: {
      marginTop: 20,
      backgroundColor: "#007bff",
      padding: 15,
      borderRadius: 8,
      width: 200,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    successText: {
        marginTop: 15,
        color: "green",
        fontSize: 16,
        fontWeight: "bold",
    },
  });