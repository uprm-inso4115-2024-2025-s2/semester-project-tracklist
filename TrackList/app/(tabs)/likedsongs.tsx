import React, { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";

const likedItems = [
  { id: "1", image: require("../../assets/images/jhayco.png") },
  { id: "2", image: require("../../assets/images/dtmf.png") },
  { id: "3", image: require("../../assets/images/jhayco.png") },
  { id: "4", image: require("../../assets/images/dtmf.png") },
  { id: "5", image: require("../../assets/images/jhayco.png") },
  { id: "6", image: require("../../assets/images/dtmf.png") },
];

const sortOptions = ["Newest to oldest", "Oldest to newest"];
const dateFilters = ["All dates", "Past week", "Past month", "Past year", "Date range"];
const artistFilters = ["JhayCo", "Kendrick Lamar", "Doja Cat", "Benson Boone", "Shaboozey"];

const LikesScreenContent = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  
  const openModal = (type: string) => {
    setFilterType(type);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  const getFilterOptions = () => {
    switch (filterType) {
      case "sort":
        return sortOptions;
      case "date":
        return dateFilters;
      case "artist":
        return artistFilters;
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Likes</Text>
        <TouchableOpacity>
          <Text style={styles.selectText}>Select</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterButton} onPress={() => openModal("sort")}> 
          <Text style={styles.filterText}>Newest to oldest ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => openModal("date")}> 
          <Text style={styles.filterText}>All Dates ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => openModal("artist")}> 
          <Text style={styles.filterText}>All Artists ▼</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={likedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{
              filterType === "sort" ? "Sort by" : 
              filterType === "date" ? "Filter by date" : 
              "Filter by singer"
            }</Text>
            {getFilterOptions().map((option, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedOption(option)} style={styles.optionButton}>
                <Text style={[styles.optionText, selectedOption === option && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function LikesScreen() {
  return (
    <ProtectedRoute>
      <LikesScreenContent />
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backText: {
    fontSize: 24,
    color: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    color: "#FF8800",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  filterButton: {
    backgroundColor: "#FFA500",
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
    height: 125,
    margin: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  closeText: {
    color: "#FF8800",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  selectedOptionText: {
    color: "#FF8800",
    fontWeight: "bold",
  },
});
