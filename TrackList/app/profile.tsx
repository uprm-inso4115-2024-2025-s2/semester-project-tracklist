import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { Keyboard, TouchableWithoutFeedback, ScrollView } from "react-native";

// Define user data type
interface UserData {
  fullName: string;
  email: string;
  bio: string;
  profilePicture: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserData;
            setUserData(data);
            setFullName(data.fullName || "");
            setBio(data.bio || "Hello! I'm new here.");
            setDateOfBirth(data.dateOfBirth || "");
            setPhoneNumber(data.phoneNumber || "");
            setProfilePicture(
              data.profilePicture || "https://example.com/default-avatar.png"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          fullName,
          bio,
          dateOfBirth,
          phoneNumber,
          profilePicture,
          updatedAt: new Date(),
        });

        Alert.alert("Success", "Profile updated!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
      console.error("Update error:", error);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;

      const response = await fetch(selectedImageUri);
      const blob = await response.blob();
      const fileSize = blob.size / (1024 * 1024); // Convert bytes to MB

      if (fileSize > 2) {
        Alert.alert("File too large", "Please select an image under 2MB.");
        return;
      }

      if (
        !selectedImageUri.endsWith(".png") &&
        !selectedImageUri.endsWith(".jpg") &&
        !selectedImageUri.endsWith(".jpeg")
      ) {
        Alert.alert(
          "Invalid file type",
          "Only PNG and JPEG files are allowed."
        );
        return;
      }

      setProfilePicture(selectedImageUri);

      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            profilePicture: selectedImageUri,
            updatedAt: new Date(),
          });

          Alert.alert("Success", "Profile picture updated!");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update profile picture.");
        console.error("Profile update error:", error);
      }
    }
  };

  if (!userData) return <Text>Loading...</Text>;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileBackground}
              />
              <TouchableOpacity onPress={handlePickImage}>
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Date of Birth */}
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              keyboardType="numeric"
            />

            {/* Phone Number */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            {/* Bio */}
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              multiline
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => router.replace("/menu")}
            >
              <Text style={styles.menuButtonText}>Back Menu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121212",
    minHeight: "100%",
  },
  profileContainer: {
    width: "100%",
    height: 200,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
  },
  profileBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#00FF99",
    position: "absolute",
    bottom: -50,
    alignSelf: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 60,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#CCCCCC",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 10,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    color: "#FFFFFF",
    height: 80,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#00FF99",
    padding: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  updateButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuButton: {
    marginTop: 10,
    backgroundColor: "#444444",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  menuButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    color: "#FFFFFF",
    height: 45,
    marginBottom: 10,
  },
});
