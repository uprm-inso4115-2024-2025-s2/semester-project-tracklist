import { useState, useEffect } from "react";
import { getAlbumTracks, getNewReleases } from "../spotify/album";
import { searchAlbums } from "../spotify/index";

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  artist: string;
  duration?: number;
}

interface Album {
  id: string;
  name: string;
}

export default function AlbumSearch() {
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<{ [key: string]: Track[] }>({});
  const [filter, setFilter] = useState({ artist: "", minDuration: 0, maxDuration: 1000 });

  useEffect(() => {
    fetchNewReleases();
  }, []);

  const handleSearch = async () => {
    const results = await searchAlbums(query);
    setAlbums(results);
  };

  const fetchTracks = async (albumId: string) => {
    if (tracks[albumId]) return;
    const albumTracks: Track[] = await getAlbumTracks(albumId);
    
    const categorizedTracks = albumTracks.map((track: Track) => ({
      ...track,
      duration: track.duration_ms / 1000, 
      artist: track.artist || "Unknown"
    }));

    setTracks((prevTracks) => ({ ...prevTracks, [albumId]: categorizedTracks }));
  };

  const fetchNewReleases = async () => {
    const newReleases = await getNewReleases();
    setAlbums(newReleases);
  };

  const filteredTracks = (albumId: string) => {
    return (tracks[albumId] || []).filter((track: Track) => 
      track.duration! >= filter.minDuration &&
      track.duration! <= filter.maxDuration &&
      (filter.artist === "" || track.artist === filter.artist)
    );
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
        <h3>Filter Tracks</h3>
        <input 
          type="number" 
          placeholder="Min Duration (s)"
          value={filter.minDuration}
          onChange={(e) => setFilter({ ...filter, minDuration: Number(e.target.value) })}
        />
        <input 
          type="number" 
          placeholder="Max Duration (s)"
          value={filter.maxDuration}
          onChange={(e) => setFilter({ ...filter, maxDuration: Number(e.target.value) })}
        />
        <input 
          type="text" 
          placeholder="Artist"
          value={filter.artist}
          onChange={(e) => setFilter({ ...filter, artist: e.target.value })}
        />
      </div>
      
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
                {filteredTracks(album.id).map((track: Track) => (
                  <li key={track.id}>{track.name} ({track.duration}s) - {track.artist}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}