// LikesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";

// Sample data
const likedItems = [
  {
    id: "1",
    image: require("../../assets/images/jhayco.png"),
    title: "Vida Rockstar",
    artist: "Le Clique: Vid...",
    author: "JHAYCO",
  },
  {
    id: "2",
    image: require("../../assets/images/dtmf.png"),
    title: "DtMF",
    artist: "DTMF",
    author: "Bad Bunny",
  },
  {
    id: "3",
    image: require("../../assets/images/jhayco.png"),
    title: "Muri",
    artist: "Le Clique: Vid...",
    author: "JHAYCO",
  },
  {
    id: "4",
    image: require("../../assets/images/dtmf.png"),
    title: "EoO",
    artist: "Le Clique: Vid...",
    author: "Bad Bunny",
  },
  {
    id: "5",
    image: require("../../assets/images/jhayco.png"),
    title: "Basquiat Vibes",
    artist: "Le Clique: Vid...",
    author: "JHAYCO",
  },
  {
    id: "6",
    image: require("../../assets/images/dtmf.png"),
    title: "DeBí TiRAR Má...",
    artist: "DTMF",
    author: "Bad Bunny",
  },
];

// Filter option sets
const sortOptions = ["Newest to oldest", "Oldest to newest"];
const dateFilters = [
  "All dates",
  "Past week",
  "Past month",
  "Past year",
  "Date range",
];
const artistFilters = [
  "JhayCo",
  "Kendrick Lamar",
  "Doja Cat",
  "Benson Boone",
  "Shaboozey",
];

// Configuration array for filters
const FILTERS = [
  { key: "sort", label: "Sort by", options: sortOptions, defaultLabel: "Newest to oldest" },
  { key: "date", label: "Filter by date", options: dateFilters, defaultLabel: "All dates" },
  { key: "artist", label: "Filter by artist", options: artistFilters, defaultLabel: "All artists" },
];

type FilterConfig = typeof FILTERS[number];

export default function LikesScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const openFilter = (key: string) => {
    setActiveFilter(key);
    setModalVisible(true);
  };

  const applyOption = (option: string) => {
    setSelectedOptions(prev => ({ ...prev, [activeFilter]: option }));
    setModalVisible(false);
  };

  // Find the active filter configuration
  const activeFilterConfig = FILTERS.find(f => f.key === activeFilter);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Likes</Text>
      </View>

      {/* Filter Bar */}
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={styles.filterButton}
            onPress={() => openFilter(f.key)}
          >
            <Text style={styles.filterText}>
              {(selectedOptions[f.key] || f.defaultLabel) + " ▼"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <FlatList
        data={likedItems}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
            <Text style={styles.songAuthor}>{item.author}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />

      {/* Filter Modal */}
      {activeFilterConfig && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{activeFilterConfig.label}</Text>
              {activeFilterConfig.options.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => applyOption(opt)}
                  style={styles.optionButton}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions[activeFilter] === opt && styles.selectedOptionText,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  filterButton: {
    backgroundColor: "#007AFF",  // blue
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  gridContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  itemContainer: {
    width: 125,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 125,
    height: 125,
    borderRadius: 8,
  },
  songTitle: {
    marginTop: 6,
    fontWeight: "600",
    color: "#000",
  },
  songArtist: {
    fontSize: 12,
    color: "#666",
  },
  songAuthor: {
    fontSize: 10,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  closeButton: {
    paddingVertical: 12,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
});
