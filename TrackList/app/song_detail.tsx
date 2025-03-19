import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Ionicons } from '@expo/vector-icons';

const SongDetail = () => {
  const { name, artist } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tracklist</Text>
        <View style={{ width: 24}} />
      </View>

      <View style={styles.trackInfoContainer}>

        {/* Song details */}
        <View style={styles.infoContainer}>
          <Text style={styles.songTitle}>Murci</Text>
          <Text style={styles.artist}>Jhayco</Text>
        </View>

        {/* Album cover*/}
        <Image
          source={require("../assets/images/jhayco.png")}
          style={styles.albumCover}
        />
        
      </View>
      <View style={styles.divider} />

      <View style={styles.detailsSpacer} />

      <View style={styles.infoContainer}>
          <Text style={styles.details}>Release Year: 2024</Text>
          <View style={styles.textYSpacer} />
          <Text style={styles.details}>Genre: Reggaeton</Text>
          <View style={styles.textYSpacer} />
          <Text style={styles.details}>Duration: 3:45</Text>
      </View>

      <View style={styles.detailsSpacer} />

      <View style={styles.divider} />


      {/* Icons */}
      <View style={styles.iconRow}>
          {/* Reviews */}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="star-outline" size={46} color="#000" />
            <Text style={styles.iconLabel}>Reviews</Text>
          </TouchableOpacity>

          <View style={styles.verticalSpacer} />

          {/* Favorite */}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={46} color="#000" />
            <Text style={styles.iconLabel}>Favorite</Text>
          </TouchableOpacity>

          <View style={styles.verticalSpacer} />

          {/* Song Credits */}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="musical-notes-outline" size={46} color="#000" />
            <Text style={styles.iconLabel}>Song Credits</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#0000",
    height: "100%",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRightSpace: {
    width: 24, 
  },
  trackInfoContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  albumCover: {
    width: 250,
    height: 200,
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "#ccc",
    alignSelf: "center",

  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "center",
  },
  detailsSpacer: {
    height: 20,
  },
  textYSpacer: {
    height: 10,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
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
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 14,
  },
  verticalSpacer: {
    height: "90%",
    width: 1,
    backgroundColor: "#ccc",
    alignSelf: "center",
  },
});

export default SongDetail;



