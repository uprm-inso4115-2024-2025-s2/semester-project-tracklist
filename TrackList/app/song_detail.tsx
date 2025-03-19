import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const SongDetail = () => {
  const { name, artist } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/jhayco.png")}
        style={styles.albumCover}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.songTitle}>{name}</Text>
        <Text style={styles.artist}>{artist}</Text>
        <Text style={styles.details}>Release Year: 2024</Text>
        <Text style={styles.details}>Genre: Reggaeton</Text>
        <Text style={styles.details}>Duration: 3:45</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#181818",
    height: "100%",
  },
  albumCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "center",
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  artist: {
    fontSize: 18,
    color: "#bbb",
    marginTop: 5,
  },
  details: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
});

export default SongDetail;



