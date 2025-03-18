import { fetchToken } from "../spotify/auth";

const SPOTIFY_TRACKS = "https://api.spotify.com/v1/tracks";
const SPOTIFY_AUDIO_FEATURES = "https://api.spotify.com/v1/audio-features?ids="
const SPOTIFY_RECOMENDATIONS = "'https://api.spotify.com/v1/recommendations?"

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