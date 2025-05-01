import { useNavigation, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Animated, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import SongReviews from '../song-reviews';
import { useColorScheme } from '@/components/useColorScheme';
const bellIcon = require('../../assets/images/Bell.png');

interface Song {
  cover: any;
  name: string;
  artist: string;
  date: string;
  id: string;
}

export default function Menu() {
  const [selectedTab, setSelectedTab] = useState<'songs' | 'reviews'>('songs');
  const [songs, setSongs] = useState<Song[]>([]);
  const navigation = useNavigation();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const mockSongs: Song[] = [
      { id: '1', cover: require('../../assets/images/jhayco.png'), name: 'Vida Rockstar', artist: 'JHAYCO', date: '2024' },
      { id: '2', cover: require('../../assets/images/jhayco.png'), name: 'Viene BASQUIAT', artist: 'JHAYCO', date: '2024' },
      { id: '3', cover: require('../../assets/images/jhayco.png'), name: 'Muri', artist: 'JHAYCO', date: '2024' },
      { id: '4', cover: require('../../assets/images/jhayco.png'), name: '100 Gramos', artist: 'JHAYCO', date: '2024' },
    ];
    setSongs(Array(3).fill(mockSongs).flat());
  }, []);

  const contentAnimation = useRef(new Animated.Value(0)).current;

  const handleTabPress = (newTab: 'songs' | 'reviews') => {
    if (newTab === selectedTab) return;
    Animated.timing(contentAnimation, {
      toValue: newTab === 'songs' ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedTab(newTab));
  };

  const contentTranslate = contentAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, -100] });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TrackList</Text>
        <TouchableWithoutFeedback onPress={() => router.push('/notification')}>
          <Image source={bellIcon} style={styles.bellIcon} />
        </TouchableWithoutFeedback>
      </View>

      {/* Tab Switch Bar */}
      <View style={styles.tabRow}>
        <TouchableWithoutFeedback onPress={() => handleTabPress('songs')}>
          <View style={[styles.tabButton, selectedTab === 'songs' && styles.activeTab]}>
            <Text style={styles.tabText}>Songs</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => handleTabPress('reviews')}>
          <View style={[styles.tabButton, selectedTab === 'reviews' && styles.activeTab]}>
            <Text style={styles.tabText}>Reviews</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Content */}
      {selectedTab === 'songs' ? (
        <Animated.View style={{ transform: [{ translateX: contentTranslate }] }}>
          <FlatList
            data={songs}
            keyExtractor={(item, idx) => `${item.id}-${idx}`}
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
        </Animated.View>
      ) : (
        <View style={styles.reviewsContainer}>
          <SongReviews trackId={songs[0]?.id || ''} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'black' },
  bellIcon: { width: 30, height: 30 },
  tabRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  tabButton: { flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 25, backgroundColor: '#444', alignItems: 'center' },
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { color: '#fff', fontWeight: 'bold' },
  songList: { paddingBottom: 20 },
  songCard: { width: '48%', backgroundColor: '#222', padding: 10, borderRadius: 10, alignItems: 'center', margin: '1%' },
  songCover: { width: 150, height: 150, borderRadius: 10, marginBottom: 5 },
  songName: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  songArtist: { color: '#bbb' },
  songDate: { color: '#888' },
  reviewsContainer: { flex: 1 },
});
