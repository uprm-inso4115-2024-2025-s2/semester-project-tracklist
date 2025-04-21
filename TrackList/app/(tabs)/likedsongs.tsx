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
  { id: "1", image: require("../../assets/images/jhayco.png") },
  { id: "2", image: require("../../assets/images/dtmf.png") },
  { id: "3", image: require("../../assets/images/jhayco.png") },
  { id: "4", image: require("../../assets/images/dtmf.png") },
  { id: "5", image: require("../../assets/images/jhayco.png") },
  { id: "6", image: require("../../assets/images/dtmf.png") },
];

// Filter option sets
const sortOptions = ["Newest to oldest", "Oldest to newest"];
const dateFilters = ["All dates", "Past week", "Past month", "Past year", "Date range"];
const artistFilters = ["JhayCo", "Kendrick Lamar", "Doja Cat", "Benson Boone", "Shaboozey"];

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
      <HeaderBar title="Likes" onBack={() => router.back()} onSelect={() => { /* future */ }} />
      <FilterBar filters={FILTERS} selectedOptions={selectedOptions} onOpen={openFilter} />
      <GridList
        items={likedItems}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
          </View>
        )}
      />

      {/* Only render modal if a filter is active */}
      {activeFilterConfig && (
        <FilterModal
          visible={modalVisible}
          filter={activeFilterConfig}
          selected={selectedOptions[activeFilter]}
          onSelect={applyOption}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

// Header with back and select
function HeaderBar({ title, onBack, onSelect }: { title: string; onBack: () => void; onSelect: () => void }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onSelect} style={styles.selectButton}>
        <Text style={styles.selectText}>Select</Text>
      </TouchableOpacity>
    </View>
  );
}

// Row of filter buttons
function FilterBar({
  filters,
  selectedOptions,
  onOpen,
}: {
  filters: FilterConfig[];
  selectedOptions: Record<string, string>;
  onOpen: (key: string) => void;
}) {
  return (
    <View style={styles.filters}>
      {filters.map(f => (
        <TouchableOpacity key={f.key} style={styles.filterButton} onPress={() => onOpen(f.key)}>
          <Text style={styles.filterText}>
            {(selectedOptions[f.key] || f.defaultLabel) + " ▼"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Generic grid list
function GridList<T>({ items, numColumns, renderItem }: { items: T[]; numColumns: number; renderItem: ({ item }: { item: T }) => JSX.Element; }) {
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item: any) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.gridContainer}
    />
  );
}

// Modal for selecting filter options
function FilterModal({
  visible,
  filter,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  filter: FilterConfig;
  selected?: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{filter.label}</Text>
          {filter.options.map((opt, idx) => (
            <TouchableOpacity key={idx} onPress={() => onSelect(opt)} style={styles.optionButton}>
              <Text style={[styles.optionText, selected === opt && styles.selectedOptionText]}>{opt}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 24,
    color: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  selectButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
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
    color: "#FF8800",
    fontWeight: "bold",
  },
  closeButton: {
    paddingVertical: 12,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#FF8800",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
});
