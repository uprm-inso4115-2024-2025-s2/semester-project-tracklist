import { signUpUser, signInUser } from "./auth.js";  // Import from auth.js

const testAuth = async () => {
  try {
    const user = await signUpUser("test@example.com", "password123");
    console.log("Signed up:", user);
  } catch (error) {
    console.error("Sign-up error:", error);
  }

  try {
    const user = await signInUser("test@example.com", "password123");
    console.log("Signed in:", user);
  } catch (error) {
    console.error("Sign-in error:", error);
  }
};

testAuth();
