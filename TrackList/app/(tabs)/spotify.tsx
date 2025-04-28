import { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { fetchToken } from '../../spotify/auth';

interface SpotifyItem {
  id: string;
  name: string;
  artists?: { name: string }[];
  label?: string;
  images?: { url: string }[];
  album?: { images: { url: string }[] }; // para tracks
}

export default function SpotifySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyItem[]>([]);
  const router = useRouter();

  const searchSpotify = async () => {
    const token = await fetchToken();

    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: query,
        type: 'track,album',
        limit: 10,
      },
    });

    const tracks: SpotifyItem[] = response.data.tracks?.items || [];
    const albums: SpotifyItem[] = response.data.albums?.items || [];

    setResults([...tracks, ...albums]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
            <TextInput
                placeholder="Buscar en Spotify"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={searchSpotify} // ← esto ejecuta la búsqueda al presionar enter
                style={styles.input}
                placeholderTextColor="#888"
                returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchSpotify}>
                <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
        </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          // obtiene la imagen desde album.images o directamente de item.images
          const imageUrl = item.album?.images?.[0]?.url || item.images?.[0]?.url;

          return (
            <TouchableOpacity onPress={() => router.push({ pathname: '../[id]', 
                params: { 
                  id: item.id,
                  name: item.name,
                  image: imageUrl, 
                  artist: item.artists?.map(a => a.name).join(', ') ?? item.label,} })}>
              <View style={styles.itemContainer}>
                {imageUrl && (
                  <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemSubtitle}>
                    {item.artists?.map(a => a.name).join(', ') ?? item.label}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#555',
  },


  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  searchContainer: {
    flexDirection: 'column', 
    alignItems: 'stretch',
    marginBottom: 16,
    gap: 8, 
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderRadius: 10,
    color: '#000',
    borderWidth: 1,
    borderColor: 'black',
  },
  searchButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  
  
  
});
