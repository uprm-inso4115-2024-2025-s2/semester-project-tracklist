import { fetchToken } from "../spotify/auth";

const TRACK_API_URL = "https://api.spotify.com/v1/audio-features";
const SPOTIFY_TRACKS = process.env.REACT_APP_SPOTIFY_TRACKS; //"https://api.spotify.com/v1/tracks";
const SPOTIFY_AUDIO_FEATURES = process.env.REACT_APP_SPOTIFY_AUDIO_FEATURES; //"https://api.spotify.com/v1/audio-features?ids="
const SPOTIFY_RECOMENDATIONS = process.env.REACT_APP_SPOTIFY_RECOMENDATIONS; // "https://api.spotify.com/v1/recommendations?"

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  year: string;
  type: "Song" | "Album";
  image: { uri: string };
}

/**
 * Fetches track details from Spotify by track ID.
 * @param {string} trackId - The Spotify ID of the track.
 * @returns {Promise<Object>} - The track data.
 */
export async function getTrackById(trackId: string) {
  try {
    const token = await fetchToken(); // Retrieve access token
    const response = await fetch(`${SPOTIFY_TRACKS}/${trackId}`, {
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

/**
 * Fetch multiple tracks' details from Spotify API.
 * @param {string[]} trackIds - An array of Spotify track IDs.
 * @returns {Promise<Object[] | null>} - An array of track data or null if an error occurs.
 */
export const getSeveralTracks = async (trackIds: string[]): Promise<Object[] | null> => {
  try {
    if (trackIds.length === 0) {
      throw new Error("No track IDs provided.");
    }

    // Convert the array of IDs into a comma-separated string
    const idsString = trackIds.join(",");

    // Make the API call
    const response = await fetch(`${SPOTIFY_TRACKS}?ids=${idsString}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch multiple tracks: ${response.statusText}`);
    } else {
      return await response.json();
    }
  } catch (error: any) {
    console.error("Error fetching multiple tracks:", error.response?.data || error.message);
    return null;
  }
};

export async function GetSeveralTracksAudioFeatures(Ids: Array<string>) {
    try {
        const token = await fetchToken(); // Retrieve access token
        const trackIds: string = Ids.join(",");
        const response = await fetch(`${SPOTIFY_AUDIO_FEATURES}${trackIds}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.audio_features;
    } catch {
        throw new Error("");
    }
}

export async function GetRecommendations(seed_artists: Array<string>, seed_genres: Array<string>, seed_tracks: Array<string>) {
    try {
      const token = await fetchToken(); // Retrieve access token

      
      const artists_str: string = seed_artists.join(",");
      const genres_str: string = seed_genres.join(",");
      const tracks_str: string = seed_tracks.join(",");

      const response = await fetch(`${SPOTIFY_RECOMENDATIONS}seed_artists=${artists_str}&seed_genres=${genres_str}&seed_tracks=${tracks_str}`, {
      headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.tracks;
  } catch {
      throw new Error("");
  }
}

/**
 * Fetch search results (tracks and albums) from Spotify API.
 * @param {string} query - The search term entered by the user.
 * @returns {Promise<SearchResult[]>} - Array of formatted song and album results.
 */
export async function fetchSpotifySearchResults(query: string): Promise<SearchResult[]> {
  try {
    const token = await fetchToken();

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,album&limit=10`;

    const response = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure correct structure before returning
    const tracks: SearchResult[] = data.tracks?.items?.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artists[0]?.name || "Unknown Artist",
      year: item.album.release_date ? item.album.release_date.split("-")[0] : "Unknown",
      type: "Song",
      image: { uri: item.album.images?.[0]?.url || "" },
    })) || [];

    const albums: SearchResult[] = data.albums?.items?.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artists[0]?.name || "Unknown Artist",
      year: item.release_date ? item.release_date.split("-")[0] : "Unknown",
      type: "Album",
      image: { uri: item.images?.[0]?.url || "" },
    })) || [];

    return [...tracks, ...albums];
  } catch (error: any) {
    console.error("Error fetching Spotify search results:", error.message);
    return [];
  }
}


export async function getTrackAudioFeatures(trackId: string): Promise<Object | null> {
  if (!trackId) {
    console.error("Error: Track ID is required.");
    return null;
  }

  try {
    const token = await fetchToken(); // Retrieve access token
    const response = await fetch(`${TRACK_API_URL}/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 400) {
      console.error("Error: Invalid Track ID.");
      return null;
    }

    if (response.status === 401) {
      console.error("Error: Unauthorized. Check API credentials.");
      return null;
    }

    if (response.status === 429) {
      console.error("Error: Rate limit exceeded. Try again later.");
      return null;
    }

    if (!response.ok) {
      console.error(`Error: Failed to fetch audio features (${response.statusText})`);
      return null;
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching track audio features:", error.message);
    return null;
  }
}