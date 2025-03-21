import Colors from "@/constants/Colors";
import { useNavigation, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";

interface Song {
  cover: any;
  name: string;
  artist: string;
  date: string;
}

const Menu: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"songs" | "reviews">("songs");
  const [songs, setSongs] = useState<Song[]>([]);
  const navigation = useNavigation();
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string>("Regular");
  const [roleLoaded, setRoleLoaded] = useState<boolean>(false);
  const userIcon = require("../assets/images/user-icon.png");

  useEffect(() => {
    navigation.setOptions({ title: "" });
  }, [navigation]);

  useEffect(() => {
    const fetchProfilePictureAndRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfilePicture(data.profilePicture || null);
          setCurrentRole(data.role || "Regular");
        }
      }
      setRoleLoaded(true);
    };

    fetchProfilePictureAndRole();

    const mockSongs: Song[] = [
      {
        cover: require("../assets/images/jhayco.png"),
        name: "Vida Rockstar",
        artist: "JHAYCO",
        date: "2024",
      },
      {
        cover: require("../assets/images/jhayco.png"),
        name: "Viene BASQUIAT",
        artist: "JHAYCO",
        date: "2024",
      },
      {
        cover: require("../assets/images/jhayco.png"),
        name: "Muri",
        artist: "JHAYCO",
        date: "2024",
      },
      {
        cover: require("../assets/images/jhayco.png"),
        name: "100 Gramos",
        artist: "JHAYCO",
        date: "2024",
      },
    ];
    const repeatedSongs = Array(3).fill(mockSongs).flat();
    setSongs(repeatedSongs);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tracklistTitle}>Tracklist</Text>
        <TouchableOpacity
          style={styles.profileIconButton}
          onPress={() => router.replace("/profile")}
        >
          <Image
            source={profilePicture ? { uri: profilePicture } : userIcon}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {roleLoaded && currentRole === "Admin" && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => router.push("/admin")}
        >
          <Text style={styles.adminButtonText}>Go to Admin Dashboard</Text>
        </TouchableOpacity>
      )}

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "songs" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("songs")}
        >
          <Text style={styles.tabButtonText}>Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "reviews" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("reviews")}
        >
          <Text style={styles.tabButtonText}>Reviews</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "songs" && (
        <FlatList
          data={songs}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.songCard}>
              <Image source={item.cover} style={styles.songCover} />
              <Text style={styles.songName}>{item.name}</Text>
              <Text style={styles.songArtist}>{item.artist}</Text>
              <Text style={styles.songDate}>{item.date}</Text>
            </View>
          )}
          contentContainerStyle={styles.songList}
        />
      )}

      {selectedTab === "reviews" && (
        <View style={styles.reviewsSection}>
          <Text style={{ color: "#fff" }}>Reviews content goes here.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tracklistTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  profileIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  adminButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  adminButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tabButton: {
    width: 172,
    height: 50,
    padding: 10,
    marginHorizontal: 4.5,
    borderRadius: 5,
    backgroundColor: "#444",
  },
  activeTab: {
    backgroundColor: "#FF8001",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 4,
  },
  songList: {
    paddingBottom: 20,
  },
  songCard: {
    width: "48%",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: "1%",
  },
  songCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  songArtist: {
    fontSize: 14,
    color: "#bbb",
  },
  songDate: {
    fontSize: 12,
    color: "#888",
  },
  reviewsSection: {
    padding: 20,
    backgroundColor: "#222",
    borderRadius: 10,
  },
});

export default Menu;
