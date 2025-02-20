import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Dummy item data
const data = [
    {
        id: "1",
        title: "DeBÍ TiRAR MáS FOToS",
        artist: "Bad Bunny",
        year: "2025",
        type: "Album",
        image: require("../../assets/images/jhayco.png"),
    },
    {
        id: "2",
        title: "Viene Basquiat",
        artist: "Jhayco",
        year: "2024",
        type: "Song",
        image: require("../../assets/images/jhayco.png"),
    },
    {
        id: "3",
        title: "Not Like Us",
        artist: "Kendrick Lamar",
        year: "2024",
        type: "Song",
        image: require("../../assets/images/jhayco.png"),
    },
    {
        id: "4",
        title: "WILDFLOWER",
        artist: "Billie Eilish",
        year: "2024",
        type: "Song",
        image: require("../../assets/images/jhayco.png"),
    },
    {
        id: "5",
        title: "Born Again",
        artist: "LISA",
        year: "2025",
        type: "Song",
        image: require("../../assets/images/jhayco.png"),
    },
    {
        id: "6",
        title: "BETTER LUCK NEXT TIME",
        artist: "Doja Cat",
        year: "2024",
        type: "Song",
        image: require("../../assets/images/jhayco.png"),
    },
    {
        id: "7",
        title: "Fórmula, Vol. 3",
        artist: "Romeo Santos",
        year: "2022",
        type: "Album",
        image: require("../../assets/images/jhayco.png"),
    },
    {
        id: "8",
        title: "ESTRELLA",
        artist: "Mora",
        year: "2023",
        type: "Song",
        image: require("../../assets/images/jhayco.png"),
    }
];

export default function Search() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // @ts-ignore
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemTextContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.itemTitle}>{item.title} </Text>
                    <Text style={styles.itemYear}>{item.year}</Text>
                </View>
                <Text style={styles.itemSubtitle}>
                    {item.type} by {item.artist}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.searchTitle}>Search</Text>
            {/* Search bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Name of song or album"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                <TouchableOpacity onPress={() => null}>
                    <Ionicons name="filter-outline" size={20} color="#666" style={styles.filterIcon} />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recently Added</Text>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fcfcfc"
    },
    searchTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginTop: 55,  
      },
    searchContainer: {
        flexDirection: "row",  // Align items horizontally
        alignItems: "center",  // Center vertically
        backgroundColor: "#f2f2f2",  // Light gray background
        borderRadius: 8,  // Rounded corners
        paddingHorizontal: 10,  // Padding inside the search box
        height: 40,  // Adjust height
        marginHorizontal: 16,  // Margin for spacing from screen edges
        marginVertical: 8,
    },
    searchIcon: {
        marginRight: 8, // Space between icon and input field
    },
    searchInput: {
        flex: 1,  // Takes full remaining width
        fontSize: 16,
        color: "#333",
    },
    filterIcon: {
        marginLeft: 8, // Space between icon and input field
    },
    sectionTitle: {
        marginLeft: 16,
        marginBottom: 8,
        fontSize: 16,
        fontWeight: "600"
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 70 // space for tab bar
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginRight: 12
    },
    itemTextContainer: {
        flex: 1
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000" // Black or dark text
    },
    itemYear: {
        fontSize: 16,
        fontWeight: "500",
        color: "#888", // Light gray color
        opacity: 0.4 // 50% opacity
    },
    itemSubtitle: {
        fontSize: 14,
        color: "#666"
    },
});
