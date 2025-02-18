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

// Example item data
const data = [
    {
        id: "1",
        title: "DeBÍ TiRAR MáS FOToS",
        artist: "Bad Bunny",
        year: "2025",
        type: "Album",
        image: "https://t2.genius.com/unsafe/600x600/https%3A%2F%2Fimages.genius.com%2F66f08db4c1d9d323ab441ab6c04a034a.1000x1000x1.png"
    },
    {
        id: "2",
        title: "Viene Basquiat",
        artist: "Jhayco",
        year: "2024",
        type: "Song",
        image: "https://t2.genius.com/unsafe/504x504/https%3A%2F%2Fimages.genius.com%2F79fb0f0fe10a96205020ee6aa1c65226.1000x1000x1.png"
    },
    {
        id: "3",
        title: "Not Like Us",
        artist: "Kendrick Lamar",
        year: "2024",
        type: "Song",
        image: "https://t2.genius.com/unsafe/504x504/https%3A%2F%2Fimages.genius.com%2F95cfea0187b37c7731e11d54b07d2415.1000x1000x1.png"
    },
    {
        id: "4",
        title: "WILDFLOWER",
        artist: "Billie Eilish",
        year: "2024",
        type: "Song",
        image: "https://t2.genius.com/unsafe/504x504/https%3A%2F%2Fimages.genius.com%2F5e7bf410789d01a90983b2641b88e5bd.1000x1000x1.png"
    },
    {
        id: "5",
        title: "Born Again",
        artist: "LISA",
        year: "2025",
        type: "Song",
        image: "https://t2.genius.com/unsafe/504x504/https%3A%2F%2Fimages.genius.com%2Fbfa9a5d7d539309ba5f562cf417b2172.1000x1000x1.png"
    },
    {
        id: "6",
        title: "BETTER LUCK NEXT TIME",
        artist: "Doja Cat",
        year: "2024",
        type: "Song",
        image: "https://t2.genius.com/unsafe/504x504/https%3A%2F%2Fimages.genius.com%2Fa14f94eeaeb85446d1842cd8de8c571d.500x500x1.jpg"
    },
    {
        id: "7",
        title: "Fórmula, Vol. 3",
        artist: "Romeo Santos",
        year: "2022",
        type: "Album",
        image: "https://t2.genius.com/unsafe/600x600/https%3A%2F%2Fimages.genius.com%2F9c679c5ed84e74f7de85732acf60c38c.1000x1000x1.png"
    },
    {
        id: "8",
        title: "ESTRELLA",
        artist: "Mora",
        year: "2023",
        type: "Song",
        image: "https://t2.genius.com/unsafe/600x0/https%3A%2F%2Fimages.genius.com%2Ff49b02e184f7be0c388b2b7cde37341a.1000x1000x1.png"
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
            <Image source={{ uri: item.image }} style={styles.itemImage} />
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
            {/* Mimic a nav bar with "Search" title */}
            <View style={styles.navBar}>
                <Text style={styles.navBarTitle}>Search</Text>
            </View>

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

            {/* Bottom tab bar with icons */}
            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => router.push("/")}>
                    <Ionicons name="home-outline" size={32} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/search")}>
                    <Ionicons name="search-outline" size={32} color="#FF6600" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Ionicons name="person-outline" size={32} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D9D9D9"
    },
    navBar: {
        paddingTop: 50, // for iOS status bar offset
        paddingBottom: 10,
        backgroundColor: "#fff",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    navBarTitle: {
        paddingTop: 10,
        fontSize: 18,
        fontWeight: "600"
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
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 80,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        backgroundColor: "#D9D9D9",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0
    }
});
