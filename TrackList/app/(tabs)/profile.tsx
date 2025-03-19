import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
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
            setBio(data.bio || "Hello! I'm new here.");
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
          bio,
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

  if (!userData)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading... No user data...</Text>
      </View>
    );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView>
        <ScrollView>
        <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profilePicture }}
          style={styles.profileBackground}
        />
        <TouchableOpacity onPress={handlePickImage}>
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{userData.fullName}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      {/* Display Date of Birth */}
      <Text style={styles.label}>Date of Birth</Text>
      <Text style={styles.infoText}>{userData.dateOfBirth || "Not provided"}</Text>

      {/* Display Phone Number */}
      <Text style={styles.label}>Phone Number</Text>
      <Text style={styles.infoText}>{userData.phoneNumber || "Not provided"}</Text>

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
        onPress={() => router.replace("../(tabs)/menu")}
      >
        <Text style={styles.menuButtonText}>Back to Menu</Text>
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
});

