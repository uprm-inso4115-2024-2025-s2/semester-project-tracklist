import axios from "axios";
import { fetchToken } from "../spotify/auth";

const ALBUM_TRACKS_URL = "https://api.spotify.com/v1/albums";

// Usage:
// Import getAlbumTracks from "./spotify/index" and call it with an album ID.
// Example:
// const tracks = await getAlbumTracks("4aawyAB9vmqN3uQ7FjRGTy");

export const getAlbumTracks = async (albumId: string) => {
  const token = await fetchToken();
  if (!token) return [];
  try {
    const response = await axios.get(`${ALBUM_TRACKS_URL}/${albumId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        duration_ms: track.duration_ms,
        artist: track.artists.map((artist: any) => artist.name).join(", "), // Extract artist name
      }));
  } catch (error) {
    console.error("Error fetching album tracks:", error);
    return [];
  }
};

export async function getNewReleases() {
  try {
    const token = await fetchToken();
    const response = await axios.get("https://api.spotify.com/v1/browse/new-releases", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.albums.items.map((album: any) => ({
      id: album.id,
      name: album.name,
      artist: album.artists.map((artist: any) => artist.name).join(", "),
      image: album.images[0]?.url,
    }));
  } catch (error) {
    console.error("Error fetching new releases:", error);
    return [];
  }
}
