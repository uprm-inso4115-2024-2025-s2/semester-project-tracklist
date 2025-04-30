import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";

interface Activity {
  id: number;
  user: string;
  profilePic: any;
  rating: number;
  albumCover: any;
  albumTitle: string;
  artist: string;
}

const activities: Activity[] = [
  {
    id: 1,
    user: "KennethS",
    profilePic: require("../../assets/images/user-icon.png"),
    rating: 5,
    albumCover: require("../../assets/images/jhayco.png"),
    albumTitle: "CALL ME IF YOU GET LOST",
    artist: "Tyler, The Creator",
  },
  {
    id: 2,
    user: "KennethS",
    profilePic: require("../../assets/images/user-icon.png"),
    rating: 4,
    albumCover: require("../../assets/images/jhayco.png"),
    albumTitle: "DAMN.",
    artist: "Kendrick Lamar",
  },
];

const ActivityTab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"friends" | "you" | "upcoming">("you");

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {["friends", "you", "upcoming"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab as "friends" | "you" | "upcoming")}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activity List */}
      <FlatList
  data={
    selectedTab === "friends"
      ? activities.filter((a) => a.user !== "KennethS")
      : selectedTab === "you"
      ? activities.filter((a) => a.user === "KennethS")
      : [] // future support for "upcoming"
  }
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.activityCard}>
      <View style={styles.userInfo}>
        <Image source={item.profilePic} style={styles.profilePic} />
        <Text style={styles.username}>{item.user}</Text>
      </View>

      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Text key={index} style={index < item.rating ? styles.starFilled : styles.starEmpty}>
            ★
          </Text>
        ))}
      </View>

      <View style={styles.albumContainer}>
        <Image source={item.albumCover} style={styles.albumCover} />
        <View>
          <Text style={styles.albumTitle}>{item.albumTitle}</Text>
          <Text style={styles.artist}>{item.artist}</Text>
        </View>
      </View>
    </View>
  )}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
    marginTop: 50
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#999",
  },
  activeText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  activityCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  starFilled: {
    color: "#FFD700",
    fontSize: 16,
  },
  starEmpty: {
    color: "#DDD",
    fontSize: 16,
  },
  albumContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  albumTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  artist: {
    fontSize: 14,
    color: "#555",
  },
});

export default ActivityTab;
