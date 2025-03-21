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

export { getTrackAudioFeatures } from "./trackService";