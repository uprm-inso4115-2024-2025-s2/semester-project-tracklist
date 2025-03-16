import { useState } from "react";
import { getAlbumTracks, getNewReleases } from "../spotify/album";
import { searchAlbums } from "../spotify/index";

export default function AlbumSearch() {
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState<any[]>([]);
  const [tracks, setTracks] = useState<{ [key: string]: any[] }>({});

  const handleSearch = async () => {
    const results = await searchAlbums(query);
    setAlbums(results);
  };

  const fetchTracks = async (albumId: string) => {
    if (tracks[albumId]) return; // Avoid redundant fetches
    const albumTracks = await getAlbumTracks(albumId);
    setTracks((prevTracks) => ({ ...prevTracks, [albumId]: albumTracks }));
  };

  const fetchNewReleases = async () => {
    const newReleases = await getNewReleases();
    setAlbums(newReleases);
  };

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "auto" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for an album..."
        style={{ border: "1px solid #ccc", padding: "8px", width: "100%", borderRadius: "4px" }}
      />
      <button 
        onClick={handleSearch} 
        style={{ backgroundColor: "#007BFF", color: "white", padding: "8px", borderRadius: "4px", marginTop: "8px", width: "100%", border: "none", cursor: "pointer" }}
      >
        Search
      </button>
      <button 
        onClick={fetchNewReleases} 
        style={{ backgroundColor: "#28A745", color: "white", padding: "8px", borderRadius: "4px", marginTop: "8px", width: "100%", border: "none", cursor: "pointer" }}
      >
        Get New Releases
      </button>
      <div style={{ marginTop: "16px" }}>
        {albums.map((album) => (
          <div key={album.id} style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "4px", marginTop: "8px" }}>
            <p style={{ fontWeight: "bold" }}>{album.name}</p>
            <button
              onClick={() => fetchTracks(album.id)}
              style={{ color: "#007BFF", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              Show Tracks
            </button>
            {tracks[album.id] && (
              <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
                {tracks[album.id].map((track) => (
                  <li key={track.id}>{track.name}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
