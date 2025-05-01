import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const userIcon = require("../assets/images/user-icon.png");
const bellIcon = require("../assets/images/Bell.png");

interface Song {
  cover: any;
  name: string;
  artist: string;
  date: string;
}

type TabKey = "songs" | "reviews";

const tabConfigs: { key: TabKey; label: string }[] = [
  { key: "songs", label: "Songs" },
  { key: "reviews", label: "Reviews" },
];

/* ----- Header Component ----- */
const MenuHeader: React.FC<{ profilePicture: string | null }> = ({
  profilePicture,
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Text style={styles.tracklistTitle}>Tracklist</Text>
      <View style={styles.iconContainer}>
        <TouchableWithoutFeedback
          onPress={() => router.push("/notification")}
        >
          <View style={styles.bellIconButton}>
            <Image source={bellIcon} style={styles.bellIcon} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => router.replace("/profile")}
        >
          <View style={styles.profileIconButton}>
            <Image
              source={profilePicture ? { uri: profilePicture } : userIcon}
              style={styles.profileIcon}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

/* ----- Tab Toggle Component ----- */
const TabToggle: React.FC<{
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}> = ({ activeTab, onTabChange }) => {
  const router = useRouter();

  return (
    <View style={styles.tabRow}>
      {tabConfigs.map((tab) => (
        <TouchableWithoutFeedback
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
        >
          <View
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTab,
            ]}
          >
            <Text style={styles.tabButtonText}>{tab.label}</Text>
          </View>
        </TouchableWithoutFeedback>
      ))}

      <TouchableWithoutFeedback onPress={() => router.push("/activity")}>
        <View style={styles.tabButton}>
          <Text style={styles.tabButtonText}>Activity</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

/* ----- Song Grid Component ----- */
const SongGrid: React.FC<{ songs: Song[] }> = ({ songs }) => (
  <FlatList
    data={songs}
    keyExtractor={(_, index) => index.toString()}
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
);

/* ----- Review Section Component ----- */
const ReviewSection: React.FC = () => (
  <View style={styles.reviewsSection}>
    <Text style={{ color: "#fff" }}>Reviews content goes here.</Text>
  </View>
);

/* ----- Main Menu Component ----- */
const Menu: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("songs");
  const [songs, setSongs] = useState<Song[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "" });
  }, [navigation]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfilePicture(userSnap.data().profilePicture || null);
        }
      }
    };

    fetchProfilePicture();

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
      <MenuHeader profilePicture={profilePicture} />
      <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "songs" && <SongGrid songs={songs} />}
      {activeTab === "reviews" && <ReviewSection />}
    </View>
  );
};

export default Menu;

/* ----- Styles ----- */
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
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIconButton: {
    marginRight: 15,
  },
  bellIcon: {
    width: 30,
    height: 30,
    tintColor: "#FF8001",
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
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tabButton: {
    width: 115,
    height: 50,
    padding: 10,
    marginHorizontal: 4.5,
    borderRadius: 25,
    backgroundColor: "#444",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#FF8001",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28,
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
