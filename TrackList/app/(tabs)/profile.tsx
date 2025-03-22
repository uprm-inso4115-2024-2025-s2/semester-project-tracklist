import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

// Define user data type
interface UserData {
  fullName: string;
  email: string;
  bio: string;
  profilePicture: string;
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

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

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Delete user data from Firestore
        await deleteDoc(doc(db, "users", user.uid));

        // Delete the Firebase Authentication user
        await user.delete();

        // Navigate to the sign-in screen
        router.replace("/signin");
        Alert.alert("Success", "Your account has been deleted.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete account. Please try again.");
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (!userData) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.searchTitle}>Profile</Text>

      {/* Profile Picture */}
      <TouchableOpacity onPress={handlePickImage}>
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      </TouchableOpacity>

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

      {/* Bio */}
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.bioInput}
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

      {/* Delete Account Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setShowDeleteModal(true)}
        disabled={deleteLoading}
      >
        {deleteLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        )}
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonDelete}
                onPress={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    backgroundColor: "#1e1e1e",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    alignSelf: "flex-start",
    marginLeft: "10%",
    color: "#fff",
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
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    height: 80,
    marginBottom: 20,
    color: "#fff",
    backgroundColor: "#333",
  },
  email: {
    fontSize: 16,
    color: "#fff", // Changed to white
    marginBottom: 10,
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
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  deleteButtonText: {
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
  searchTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 55,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButtonCancel: {
    padding: 10,
    marginRight: 10,
  },
  modalButtonDelete: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});