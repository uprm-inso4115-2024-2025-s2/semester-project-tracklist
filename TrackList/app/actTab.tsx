import React, { useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";

interface Track {
  id: string;
  username: string;
  title: string;
  artist: string;
  rating: number;
  image: string;
}

const trackData: Track[] = [
  {
    id: "1",
    username: "LocalMusicEnthusiast420",
    title: "Debí TIRAR MÁS FOTOѕ",
    artist: "un álbum inolvidable",
    rating: 5,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    username: "LocalMusicEnthusiast420",
    title: "IGOR",
    artist: "Neat",
    rating: 5,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    username: "LukeSkywalker123",
    title: "Gran Turismo 4 Original Soundtrack",
    artist: "Perfection",
    rating: 5,
    image: "https://via.placeholder.com/150",
  },
];

const ActTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Friends");

  const renderStars = (count: number): string => "⭐".repeat(count);

  const renderItem = ({ item }: { item: Track }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: "https://via.placeholder.com/40" }} style={styles.avatar} />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <Text style={styles.rating}>{renderStars(item.rating)}</Text>
      <View style={styles.details}>
        <Image source={{ uri: item.image }} style={styles.albumCover} />
        <View style={styles.textDetails}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.artist}>{item.artist}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["Friends", "You", "Upcoming"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditional Content */}
      {activeTab === "Friends" ? (
        <FlatList
          data={trackData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No content available for {activeTab}.</Text>
        </View>
      )}
    </View>
  );
};

export default ActTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",  // White background
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",  // White tabs background
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#007bff",  // Blue for active tab
  },
  tabText: {
    color: "#555",  // Darker gray for inactive tabs
    fontSize: 16,
  },
  activeTabText: {
    color: "#ffffff",  // White text for active tab
    fontWeight: "bold",
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: "#ffffff",  // White card background
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "#333",  // Dark text for usernames
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    color: "#ffd700",  // Gold stars
    marginBottom: 10,
    fontSize: 16,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  textDetails: {
    justifyContent: "center",
  },
  title: {
    color: "#333",  // Dark text for titles
    fontSize: 18,
    fontWeight: "bold",
  },
  artist: {
    color: "#777",  // Gray for artist text
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
  },
});
