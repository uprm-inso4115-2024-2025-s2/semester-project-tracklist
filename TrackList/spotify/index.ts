// Example:
// export { default as auth } from "./auth";
// export { default as trackService } from "./trackService";
// export { default as artistService } from "./artistService";
// export { default as playlistService } from "./playlistService";

import { fetchToken } from "../spotify/auth";

const SEARCH_URL = "https://api.spotify.com/v1/search";

// Usage:
// Import searchAlbums from "./spotify/index" and call it with a search query string.
// Example:
// const albums = await searchAlbums("Taylor Swift");

export const searchAlbums = async (query: string) => {
  const token = await fetchToken();
  if (!token) return [];
  const response = await fetch(`${SEARCH_URL}?q=${query}&type=album`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.albums?.items || [];
};

const ALBUM_TRACKS_URL = "https://api.spotify.com/v1/albums";

// Usage:
// Import getAlbumTracks from "./spotify/index" and call it with an album ID.
// Example:
// const tracks = await getAlbumTracks("4aawyAB9vmqN3uQ7FjRGTy");

export const getAlbumTracks = async (albumId: string) => {
  const token = await fetchToken();
  if (!token) return [];
  const response = await fetch(`${ALBUM_TRACKS_URL}/${albumId}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.items || [];
};

const SPOTIFY_API_URL = "https://api.spotify.com/v1/tracks";

/**
 * Fetches track details from Spotify by track ID.
 * @param {string} trackId - The Spotify ID of the track.
 * @returns {Promise<Object>} - The track data.
 */

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
    const response = await fetch(`${SPOTIFY_API_URL}?ids=${idsString}`);

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

// Note: these constant should be on the Env section
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
 * Fetch multiple artists' details from Spotify API.
 * @param {string[]} artistIds - An array of Spotify artist IDs.
 * @returns {Promise<Object[] | null>} - An array of artist data or null if an error occurs.
 */
export const getSeveralArtists = async (artistIds: string[]): Promise<Object[] | null> => {
  try {
    if (artistIds.length === 0) {
      throw new Error("No artist IDs provided.");
    }

    // Convert the array of IDs into a comma-separated string
    const idsString = artistIds.join(",");

    // Make the API call
    const response = await fetch(`${ARTISTS_API_URL}?ids=${idsString}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch multiple artists: ${response.statusText}`);
    } else {
      return await response.json();
    }
  } catch (error: any) {
    console.error("Error fetching multiple artists:", error.response?.data || error.message);
    return null;
  }
};

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

export async function getNewReleases() {
  try {
    const token = await fetchToken();
    const response = await fetch("https://api.spotify.com/v1/browse/new-releases", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.albums.items.map((album: any) => ({
      id: album.id,
      name: album.name,
      artist: album.artists.map((artist: any) => artist.name).join(", "),
      image: album.images[0]?.url,
    }));
  } catch (error: any) {
    console.error("Error fetching new releases:", error.message);
    return [];
  }
}

// Playlists

/**
 * Fetches a Spotify playlist's metadata and tracks.
 *
 * @param {string} playlistId - The Spotify playlist ID.
 * @returns {Promise<{playlistInfo: object, playlistTracks: object[]} | null>}
 *          A promise that resolves to an object containing playlist metadata and an array of tracks,
 *          or null if the playlist is empty or an error occurs.
 */
export async function fetchSpotifyPlaylist(playlistId: string) {
  const token = await fetchToken();
  try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });
      if (!response.ok) {
          throw new Error(`Error fetching playlist: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const playlistInfo = {
        collaborative: data.collaborative, // Boolean
        description: data.description, // May be null
        externalURLs: data.external_urls,
        followers: data.followers,
        href: data.href,
        id: data.id,
        images: data.images,
        name: data.name,
        owner: data.owner,
        public: data.public, // Boolean
        snapshotId: data.snapshot_id,
        uri: data.uri // Spotify uri for the playlist
      };
      const playlistLength = data.tracks.total;
      if (playlistLength <= 0) {
        console.error("Playlist is empty");
        return null;
      }
      let playlistTracks = [];
      for (let i = 0; i < playlistLength; i++) {
        playlistTracks.push(data.tracks.items[i]);
      }
      return {playlistInfo, playlistTracks};
  } catch (error) {
      console.error("Failed to fetch playlist:", error);
      return null;
  }
}


