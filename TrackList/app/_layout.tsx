import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="signin" options={{ title: "Sign In" }} />
      <Stack.Screen name="homepage" options={{ title: "Home" }} /> 
    </Stack>
  );
}
