import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

// Define user data type
interface UserData {
  fullName: string;
  email: string;
  username: string;
  bio: string;
  profilePicture: string;
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);

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
            setUsername(data.username || "NewUser");
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
      if (!username.trim()) {
        Alert.alert("Error", "Username cannot be empty.");
        return;
      }

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          username,
          bio,
          profilePicture,
          updatedAt: new Date(),
        });

        setIsEditingUsername(false); // Exit edit mode after saving
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
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage}>
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={styles.name}>{userData.fullName}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      <Text style={styles.label}>Username</Text>
      {isEditingUsername ? (
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      ) : (
        <Text style={styles.username}>{username}</Text>
      )}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          if (isEditingUsername) {
            handleUpdateProfile();
          } else {
            setIsEditingUsername(true);
          }
        }}
      >
        <Text style={styles.editButtonText}>
          {isEditingUsername ? "Save" : "Edit"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.bioInput}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.replace("/menu")}
      >
        <Text style={styles.menuButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#00FF99",
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
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
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    color: "#FFFFFF",
    height: 40,
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
  editButton: {
    marginTop: 10,
    backgroundColor: "#00FF99",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#000000",
    fontWeight: "bold",
  },
  menuButton: {
    marginTop: 20,
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