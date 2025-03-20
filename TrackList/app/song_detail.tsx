import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const SongDetail = () => {
  const { name, artist } = useLocalSearchParams();
  const [creditsVisible, setCreditsVisible] = React.useState(false);

  //temp data
  const similarSongs = [
    { name: "Murci", artist: "Jhayco" },
    { name: "Dakiti", artist: "Bad Bunny" },
    { name: "La Noche de Anoche", artist: "Bad Bunny" },
    { name: "Bichota", artist: "Karol G" },
    { name: "Hawái", artist: "Maluma" },
    { name: "Bandido", artist: "Myke Towers" },
  ];

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
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
          <TouchableOpacity style={styles.iconButton} onPress={() => setCreditsVisible(true)}>
            <Ionicons name="musical-notes-outline" size={46} color="#000" />
            <Text style={styles.iconLabel}>Song Credits</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Modal visible={creditsVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Song Credits:</Text>
            <Text style={styles.modalText}>Performed by: Jhayco</Text>
            <Text style={styles.modalText}>Written by: Jhayco</Text>
            <Text style={styles.modalText}>Produced by: Tainy</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setCreditsVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.moreLikeThis}>
        <Text style={styles.moreLikeThisTitle}>More Like This</Text>
        <View style={styles.moreLikeThisList}>
          <View style={styles.moreSongItem}>
            <Image source={require("../assets/images/jhayco.png")} style={styles.moreAlbumCover} />
            <Text style={styles.moreSong}>Otro Fili - Jhayco</Text>
          </View>
          <View style={styles.moreSongItem}>
            <Image source={require("../assets/images/jhayco.png")} style={styles.moreAlbumCover} />
            <Text style={styles.moreSong}>Murci - Jhayco</Text>
          </View>
          <View style={styles.moreSongItem}>
            <Image source={require("../assets/images/jhayco.png")} style={styles.moreAlbumCover} />
            <Text style={styles.moreSong}>100 Gramos - Jhayco</Text>
          </View>
        </View>
      </View>

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
  },
  moreLikeThisList: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  moreLikeThis: {
    padding: 16,
  },
  moreLikeThisTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  moreSongItem: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  moreAlbumCover: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  moreSong: {
    fontSize: 14,
    textAlign: "center",
  },

});

export default SongDetail;



