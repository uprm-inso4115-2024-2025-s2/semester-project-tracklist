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
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

// Define user data type
interface UserData {
  fullName: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: string;
  followers: number;
  following: number;
  reviews: number;
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

  if (!userData) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Username */}
      <Text style={styles.username}>@{userData.username}</Text>

      {/* Header Section: Profile Image & Stats */}
      <View style={styles.header}>
        {/* Profile Image */}
        <TouchableOpacity onPress={handleUpdateProfile}>
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        </TouchableOpacity>

        {/* Follower Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userData.followers}</Text>
            <Text style={styles.statLabel}>followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userData.following}</Text>
            <Text style={styles.statLabel}>following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userData.reviews}</Text>
            <Text style={styles.statLabel}>reviews</Text>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.bioInput}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      {/* Update Profile Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateProfile}
      >
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>

      {/* Back to Menu Button */}
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
    backgroundColor: "#fff",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ddd",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    height: 80,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
  },
  updateButtonText: { color: "#fff", fontWeight: "bold" },
  menuButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },
  menuButtonText: { color: "#fff", fontWeight: "bold" },
});

