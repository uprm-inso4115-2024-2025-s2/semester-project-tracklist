
import { fetchToken } from "../spotify/auth";
const SEARCH_URL = "https://api.spotify.com/v1/search";
const SPOTIFY_API_URL = "https://api.spotify.com/v1/tracks";

export async function getTrackById(trackId: string) {
  try {
    const token = await fetchToken(); // Retrieve access token
    const response = await fetch(`${SPOTIFY_API_URL}/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const trackInfo = {
      trackName: data.name,
      artistName: data.artists.map((artist: any) => artist.name).join(", "),
      albumCover: data.album.images[0]?.url || "", // First album image
      releaseDate: data.album.release_date,
    };
    const stringArray = [
      `Track: ${trackInfo.trackName}`,
      `Artist(s): ${trackInfo.artistName}`,
      `Album: ${data.album.name}`,
      `Release Date: ${trackInfo.releaseDate}`,
      `Listen: ${data.external_urls.spotify}`,
    ].map((item) => item.toString());

    return {trackInfo, stringArray};
  } catch (error: any) {
    console.error("Error fetching track:", error.response?.data || error.message);

    return { 
      trackInfo: {
        trackName: "Unknown",
        artistName: "Unknown",
        albumCover: "",
        releaseDate: "Unknown",
      }, 
      stringArray: ["Error fetching track data."]
    };
  }
}