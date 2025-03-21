import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  ActionSheetIOS
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface UserRecord {
  id: string;
  fullName?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export default function AdminScreen() {
  const router = useRouter();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("Admin");
  const [loadingAuth, setLoadingAuth] = useState(true);

  const getBadgeStyle = (role: string | undefined) => {
    switch (role) {
      case "Admin":
        return { backgroundColor: "#e74c3c" };
      case "Moderator":
        return { backgroundColor: "#3498db" };
      case "Regular":
      default:
        return { backgroundColor: "#2ecc71" };
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const role = data.role || "Regular";
            setCurrentUserRole(role);
            if (role !== "Admin") {
              Alert.alert("Access Denied", "You are not an Admin.");
              router.replace("/menu");
            }
          } else {
            Alert.alert("Error", "No user doc found for current user.");
            router.replace("/menu");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      } else {
        Alert.alert("Not Logged In", "Please sign in first.");
        router.replace("/signin");
      }
      setLoadingAuth(false);
    });

    return () => unsubscribeAuth();
  }, []);


  useEffect(() => {
    if (currentUserRole === "Admin") {
      const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
        const allUsers: UserRecord[] = [];
        snapshot.forEach((docSnap) => {
          allUsers.push({ id: docSnap.id, ...docSnap.data() });
        });
        setUsers(allUsers);
      });
      return () => unsub();
    }
  }, [currentUserRole]);

  // Search filter for users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        (u.fullName && u.fullName.toLowerCase().includes(lowerSearch)) ||
        (u.email && u.email.toLowerCase().includes(lowerSearch))
    );
  }, [users, searchTerm]);

  if (loadingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading authentication...</Text>
      </View>
    );
  }

  if (currentUserRole !== "Admin") {
    return (
      <View style={styles.loadingContainer}>
        <Text>Not authorized or loading...</Text>
      </View>
    );
  }

  const handleRoleChange = async (
    userId: string,
    newRole: string,
    currentRoleOfUser?: string
  ) => {
    if (currentRoleOfUser === "Admin" && newRole !== "Admin") {
      Alert.alert(
        "Not Allowed",
        "Admin roles can only be changed via the Firebase Console."
      );
      return;
    }
    if (userId === currentUserId && newRole !== "Admin") {
      Alert.alert("Error", "You cannot remove your own Admin role.");
      return;
    }
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "Failed to update user role.");
    }
  };

  // For iOS dropdown
  const showRoleActionSheet = (user: UserRecord) => {
    const options = ["Cancel", "Regular", "Moderator", "Admin"];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex > 0) {
          const selectedRole = options[buttonIndex];
          if (selectedRole !== user.role) {
            handleRoleChange(user.id, selectedRole, user.role);
          }
        }
      }
    );
  };

  // Render each user row
  const renderUserItem = ({ item }: { item: UserRecord }) => (
    <View style={styles.userRow}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{item.fullName ?? "(No Name)"}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={[styles.badge, getBadgeStyle(item.role)]}>
          <Text style={styles.badgeText}>{item.role}</Text>
        </View>
      </View>
      <View style={styles.roleSelectorContainer}>
        {Platform.OS === "ios" ? (
          <TouchableOpacity
            style={styles.iosRoleButton}
            onPress={() => showRoleActionSheet(item)}
            disabled={item.role === "Admin"}
          >
            <Text style={styles.iosRoleButtonText}>
              {item.role ?? "Regular"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </TouchableOpacity>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              mode="dropdown"
              selectedValue={item.role ?? "Regular"}
              style={styles.picker}
              enabled={item.role !== "Admin"}
              onValueChange={(val) =>
                handleRoleChange(item.id, val, item.role)
              }
            >
              <Picker.Item label="Regular" value="Regular" />
              <Picker.Item label="Moderator" value="Moderator" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/menu")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  roleSelectorContainer: {
    justifyContent: "center",
  },
  iosRoleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  iosRoleButtonText: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
  },
  pickerContainer: {
    width: 130,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
    height: 40,
  },
});
