import { fetchToken } from "../spotify/auth";

const ARTISTS_API_URL = process.env.REACT_APP_SPOTIFY_ARTISTS; //"https://api.spotify.com/v1/artists";

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

/**
 * Fetches the top tracks of an artist from Spotify.
 * @param {string} artistId - The Spotify ID of the artist.
 * @param {string} [country="US"] - The country code for track filtering.
 * @returns {Promise<Object | null>} - The top tracks data or null if an error occurs.
 */
export async function getTopTracks(artistId: string, country: string = "US"): Promise<Object | null> {
  try {
    const token = await fetchToken(); // Retrieve access token
    const response = await fetch(`${ARTISTS_API_URL}/${artistId}/top-tracks?market=${country}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top tracks: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching top tracks:", error.message);
    return null;
  }
}

/**
 * Fetches the top tracks of an artist from Spotify.
 * @param {string} artistId - The Spotify ID of the artist.
 * @returns {Promise<Object | null>} - The artist or null if an error occurs.
 */
export async function getArtist(artistId: string): Promise<Object | null> {
  try {
    const token = await fetchToken(); // Retrieve access token
    const response = await fetch(`${ARTISTS_API_URL}/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artist: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching artist:", error.message);
    return null;
  }
}

/**
 * Fetches the top tracks of an artist from Spotify.
 * @param {string} artistId - The Spotify ID of the artist.
 * @returns {Promise<Object | null>} - The artist or null if an error occurs.
 */
export const getAlbumsFromArtist = async (artistId: string) => {
  const token = await fetchToken();
  if (!token) return [];
  const response = await fetch(`${ARTISTS_API_URL}/${artistId}/albums`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.items || [];
};