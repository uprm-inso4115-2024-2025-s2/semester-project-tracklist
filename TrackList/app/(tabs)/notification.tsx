import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface Notification {
  id: string;
  username: string;
  message: string;
  profilePicture: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      username: "LukeSkywalker123",
      message: "started following you.",
      profilePicture: "https://example.com/luke.png",
    },
    {
      id: "2",
      username: "DarthVader",
      message: "liked your song.",
      profilePicture: "https://example.com/vader.png",
    },
  ]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.notifications) {
              setNotifications(userData.notifications);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
            <Text style={styles.text}>
              <Text style={styles.username}>{item.username}</Text> {item.message}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff", 
      padding: 20,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#000",
      marginBottom: 15,
    },
    notificationItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f5f5f5", 
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    text: {
      color: "#000", 
      fontSize: 14,
    },
    username: {
      fontWeight: "bold",
      color: "#000", 
    },
  });