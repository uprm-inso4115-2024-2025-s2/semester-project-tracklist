import { useNavigation, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Animated } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';

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
  const colorScheme = useColorScheme();

  // Hide header so that no back button interferes with the bottom nav bar.
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const mockSongs: Song[] = [
      { cover: require('../../assets/images/jhayco.png'), name: 'Vida Rockstar', artist: 'JHAYCO', date: '2024' },
      { cover: require('../../assets/images/jhayco.png'), name: 'Viene BASQUIAT', artist: 'JHAYCO', date: '2024' },
      { cover: require('../../assets/images/jhayco.png'), name: 'Muri', artist: 'JHAYCO', date: '2024' },
      { cover: require('../../assets/images/jhayco.png'), name: '100 Gramos', artist: 'JHAYCO', date: '2024' },
    ];
    // Repeat songs to fill more rows
    const repeatedSongs = Array(3).fill(mockSongs).flat();
    setSongs(repeatedSongs);
  }, []);

  // Animate the content switch between Songs and Reviews (if desired)
  const contentAnimation = useRef(new Animated.Value(0)).current;

  const handleTabPress = (newTab: 'songs' | 'reviews') => {
    if (newTab === selectedTab) return;

    // Animate content transition – for example, a slight horizontal slide
    Animated.timing(contentAnimation, {
      toValue: newTab === 'songs' ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedTab(newTab);
    });
  };

  const contentTranslate = contentAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100] // Adjust this value as needed for your desired effect
  });

  return (
    <View style={styles.container}>


      <Text style={styles.tracklistTitle}>TrackList</Text>

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

      <Animated.View style={{ transform: [{ translateX: contentTranslate }] }}>
        {selectedTab === 'songs' && (
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

        {selectedTab === 'reviews' && (
          <View style={styles.reviewsSection}>
            <Text style={{ color: '#fff' }}>Reviews content goes here.</Text>
          </View>
        )}
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
  tracklistTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 35,  
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
    backgroundColor: '#007AFF',
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
    width: '48%',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: '1%',
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
});

export default Menu;
