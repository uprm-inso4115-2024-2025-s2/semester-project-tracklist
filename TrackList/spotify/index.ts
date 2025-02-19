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