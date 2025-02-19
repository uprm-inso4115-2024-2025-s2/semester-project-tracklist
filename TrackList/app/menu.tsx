import { useNavigation, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Animated } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface Song {
  cover: any;
  name: string;
  artist: string;
  date: string;
}

const Menu: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'songs' | 'reviews'>('songs');
  const [songs, setSongs] = useState<Song[]>([]);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ title: '' });
  }, [navigation]);

  useEffect(() => {
    const mockSongs: Song[] = [
      { cover: require('../assets/images/jhayco.png'), name: 'Vida Rockstar', artist: 'JHAYCO', date: '2024' },
      { cover: require('../assets/images/jhayco.png'), name: 'Viene BASQUIAT', artist: 'JHAYCO', date: '2024' },
      { cover: require('../assets/images/jhayco.png'), name: 'Muri', artist: 'JHAYCO', date: '2024' },
      { cover: require('../assets/images/jhayco.png'), name: '100 Gramos', artist: 'JHAYCO', date: '2024' },
    ];    

    // Repeat songs to fill more rows
    const repeatedSongs = Array(3).fill(mockSongs).flat();
    setSongs(repeatedSongs);
  }, []);

  const tabBarAnimation = React.useRef(new Animated.Value(0)).current;

  const handleTabPress = (newTab: 'songs' | 'reviews') => {
    if (newTab === selectedTab) return;

    const animationConfig = {
      toValue: newTab === 'songs' ? 1 : -1,
      duration: 200,
      useNativeDriver: true,
    };

    Animated.timing(tabBarAnimation, animationConfig).start(() => {
      setSelectedTab(newTab);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tracklistTitle}>Tracklist</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'songs' && styles.activeTab]}
          onPress={() => handleTabPress('songs')}
        >
          <Text style={styles.tabButtonText}>Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'reviews' && styles.activeTab]}
          onPress={() => handleTabPress('reviews')}
        >
          <Text style={styles.tabButtonText}>Reviews</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'songs' && (
        <FlatList
          data={songs}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Two columns
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

      {selectedTab === 'reviews' && (
        <View style={styles.reviewsSection}>
          <Text style={{ color: '#fff' }}>Reviews content goes here.</Text>
        </View>
      )}
      {/* Bottom tab bar with icons */}
      <Animated.View
        style={[
          styles.tabBar,
          {
            transform: [{ translateX: tabBarAnimation.interpolate({
              inputRange: [-1, 1],
              outputRange: [-100, 100],
            }) }],
          },
        ]}
      >
                <TouchableOpacity onPress={() => router.push("/menu")}>
                    <Ionicons name="home-outline" size={40} color="#FF6600" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/search")}>
                    <Ionicons name="search-outline" size={32} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Ionicons name="person-outline" size={32} color="#333" />
                </TouchableOpacity>
            </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    padding: 20,
  },
  albumCover: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  tracklistTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    width: 172,
    height: 50,
    padding: 10,
    marginHorizontal: 4.5,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  activeTab: {
    backgroundColor: '#FF8001',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 4,
  },
  songList: {
    paddingBottom: 20,
  },
  songCard: {
    width: '48%', // 48% to allow spacing between items
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: '1%', // Add spacing between columns
  },
  songCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  songName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  songArtist: {
    fontSize: 14,
    color: '#bbb',
  },
  songDate: {
    fontSize: 12,
    color: '#888',
  },
  reviewsSection: {
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 10,
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
  },
});

export default Menu;

