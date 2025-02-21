import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signInUser } from "../auth"; // Import sign-in function

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      const user = await signInUser(email, password);
      console.log("Signed in:", user);
      // Navigate to the home/profile screen after login
      navigation.replace("HomeScreen"); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      
      <Button title="Sign In" onPress={handleSignIn} />

      {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}

      <Text 
        style={{ marginTop: 20, color: "blue" }} 
        onPress={() => navigation.navigate("SignUpScreen")}
      >
        Don't have an account? Sign up here.
      </Text>
    </View>
  );
};

export default SignInScreen;