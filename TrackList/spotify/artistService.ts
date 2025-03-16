
import { fetchToken } from "../spotify/auth";

const ARTISTS_API_URL = "https://api.spotify.com/v1/artists";

/**
 * Fetches related artists from Spotify by artist ID.
 * @param {string} artistId - The Spotify ID of the artist.
 * @returns {Promise<Object | null>} - The related artists data or null if an error occurs.
 */
export async function getRelatedArtists(artistId: string): Promise<Object | null> {
  try {
    const token = await fetchToken(); // Retrieve access token
    const response = await fetch(`${ARTISTS_API_URL}/${artistId}/related-artists`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch related artists: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching related artists:", error.message);
    return null;
  }
}