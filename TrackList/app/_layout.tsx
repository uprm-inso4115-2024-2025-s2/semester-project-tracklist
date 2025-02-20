import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="search" />
      <Stack.Screen name="homepage" />
    </Stack>
  );
}
