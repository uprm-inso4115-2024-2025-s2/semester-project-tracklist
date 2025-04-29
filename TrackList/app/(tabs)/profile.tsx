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
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

interface UserData {
  fullName: string;
  email: string;
  bio: string;
  profilePicture: string;
  dateOfBirth: string;
  phoneNumber: string;
  followers?: number;
  reviews?: number;
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");

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
      setLoading(true);
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
        setEditMode(false);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmChangePassword = async () => {
    if (!newPassword.trim() || newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        Alert.alert("Success", "Password updated successfully!");
        setNewPassword("");
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      if (error.code === "auth/requires-recent-login") {
        Alert.alert("Session Expired", "Please re-login and try again.");
      } else {
        Alert.alert("Error", error.message);
      }
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
      setProfilePicture(result.assets[0].uri);
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF99" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* Top Banner */}
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.bannerImage}
            />
            <View style={styles.overlay} />

            {/* Followers and Reviews */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                Followers: {userData.followers ?? 123}
              </Text>
              <Text style={styles.statsText}>
                Reviews: {userData.reviews ?? 45}
              </Text>
            </View>

            {/* Small Circular Profile Pic */}
            <TouchableOpacity onPress={handlePickImage}>
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <Text style={styles.fullNameText}>{fullName}</Text>

          {/* Bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{bio}</Text>
          </View>

          {/* Buttons */}
          {!editMode ? (
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.updateButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.bioInput}
                placeholder="Bio"
                value={bio}
                onChangeText={setBio}
                multiline
              />

              {/* Change Password */}
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleConfirmChangePassword}
              >
                <Text style={styles.updateButtonText}>Change Password</Text>
              </TouchableOpacity>

              {/* Save or Cancel */}
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.updateButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => {
                  setEditMode(false);
                  setNewPassword("");
                }}
              >
                <Text style={styles.menuButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  bannerContainer: {
    width: "100%",
    height: 200,
    position: "relative",
    backgroundColor: "#333",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  statsContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    alignItems: "flex-end",
  },
  statsText: {
    color: "#FFF",
    fontSize: 14,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#00FF99",
    position: "absolute",
    bottom: -55,
    alignSelf: "center",
  },
  fullNameText: {
    marginTop: 70,
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  bioContainer: {
    marginTop: 20,
    width: "90%",
    padding: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
  },
  bioText: {
    color: "#CCC",
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    width: "90%",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    width: "90%",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    height: 100,
  },
  updateButton: {
    backgroundColor: "#00FF99",
    padding: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  menuButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
