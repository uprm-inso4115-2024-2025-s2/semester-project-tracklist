import { fetchToken } from "../spotify/auth";
// Usage:
// Import getAlbumTracks from "./spotify/index" and call it with an album ID.
// Example:
// const tracks = await getAlbumTracks("4aawyAB9vmqN3uQ7FjRGTy");

export const getAlbumTracks = async (albumId: string) => {
  const token = await fetchToken();
  if (!token) return [];
  try {
    const response = await fetch(`${process.env.ALBUM_API_URL}/${albumId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.items.map((track: any) => ({
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
    const response = await fetch(`${process.env.BROWSE_API_URL}/new-releases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.albums.items.map((album: any) => ({
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
