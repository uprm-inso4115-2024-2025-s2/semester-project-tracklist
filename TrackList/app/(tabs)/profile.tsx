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
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
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
  followers?: number;
  following?: number;
  reviews?: number;
  dateOfBirth: string;
  phoneNumber: string;
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
            setProfilePicture(
              data.profilePicture ||
                "https://example.com/default-avatar.png"
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
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name.");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          fullName,
          bio,
          profilePicture,
          updatedAt: new Date(),
        });

        Alert.alert("Success", "Profile updated!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView>
          <View style={styles.container}>
            {/* Header */}
            <Text style={styles.searchTitle}>Profile</Text>

            {/* Avatar */}
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

            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />

            {/* Email (Read-only) */}
            <Text style={styles.label}>Email</Text>
            <Text style={styles.email}>{userData.email}</Text>

            {/* Followers, Following, Reviews */}
            {userData.followers !== undefined && (
              <Text style={styles.infoText}>
                Followers: {userData.followers}
              </Text>
            )}
            {userData.following !== undefined && (
              <Text style={styles.infoText}>
                Following: {userData.following}
              </Text>
            )}
            {userData.reviews !== undefined && (
              <Text style={styles.infoText}>
                Reviews: {userData.reviews}
              </Text>
            )}

            {/* Bio */}
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              multiline
              placeholder="Tell us about yourself"
              placeholderTextColor="#999"
            />

            {/* Update Profile Button */}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.updateButtonText}>Update Profile</Text>
              )}
            </TouchableOpacity>

            {/* Back to Menu Button */}
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => router.replace("/menu")}
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
    backgroundColor: "#1e1e1e",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    position: "absolute",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 55,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    alignSelf: "flex-start",
    marginLeft: "10%",
    color: "#fff",
  },
  email: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#333",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  menuButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  menuButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
