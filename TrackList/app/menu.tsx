import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";

export default function Menu() {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/signup"); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TrackList Menu</Text>
      <Text style={styles.subtitle}>This is a placeholder screen for the main menu.</Text>

      <View style={styles.buttonContainer}>
        <CustomButton text="Back to Home" onPress={() => router.push("/")} />
      </View>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    marginTop: 10,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
