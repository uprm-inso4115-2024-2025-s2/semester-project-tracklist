import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchSpotifyPlaylist } from "../spotify/index";
import React, { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    async function testFetch() {
      //Para generar un access token ver instrucciones en TrackList/spotify/index
      const accessToken = "BQC_xUQCC428u0-hcBuRaob7WQXQtokZJFsnFMZ18gtMSd4GnQeC0lO0BHhVfLjY3I7NQnrtLjUpoIiJYeUhiaHdQKoDFzLQKWsqGRUu34TLSEyrxfJpiMWXoe5DgcYDzOyAcbt-Dz0";
      const data = await fetchSpotifyPlaylist("6sLduR2AOGxBXm4JJgbNWl", accessToken); //cambia el id del linlk del playlist para fetch la data
      //console.log("Fetched Playlist Data:", data); //aqui es para el testing de fetch playlist
      
    }

    testFetch();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TrackList</Text>
      {playlist ? (
        <Text style={styles.subtitle}>Playlist: {playlist}</Text>
      ) : (
        <Text style={styles.subtitle}>Fetching playlist...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push("/signin")}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/signup")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    marginTop: 10,
    color: "#666",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});
