import { useState } from "react";
import { signUpUser } from "../auth";  // Import sign-up function

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await signUpUser(email, password);
      console.log("Signup successful!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="Sign Up" onPress={handleSignup} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
};

export default SignUpScreen;