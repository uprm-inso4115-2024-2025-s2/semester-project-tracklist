import { useLocalSearchParams } from 'expo-router';
import { Image, Text, View, StyleSheet } from 'react-native';

export default function DetailScreen() {
  const { name, image, artist } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: image as string }} 
        style={styles.image} 
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.artist}>Artista: {artist}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});
