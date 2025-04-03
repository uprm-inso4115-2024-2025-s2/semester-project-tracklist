import { useState, useEffect } from "react";
import { getAlbumTracks, getNewReleases} from "../spotify/album";
import { searchAlbums } from "../spotify/index";
import { StyleSheet, ScrollView } from "react-native";

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
  const [showTracks, setShowTracks] = useState<{[key: string]: boolean}>({});

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
    <ScrollView>
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
        style={styles.searchCard}
      >
        Search
      </button>
      <button 
        onClick={fetchNewReleases} 
        style={styles.newReleasesCard}
      >
        Get New Releases
      </button>
      
      <div style={{ marginTop: "16px" }}>
        <h3 style={styles.header}>Filter Tracks</h3>
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
      
      <div style={ {marginTop: "16px"} }>
        {albums.map((album) => (
          <div key={album.id} style={styles.albumCard}>
            <p style={styles.albumName}>{album.name}</p>
            <button
              onClick={!showTracks[album.id] ? () => (fetchTracks(album.id), setShowTracks(() => ({[album.id]: true}))) : () => setShowTracks(() => ({[album.id]: false}))}
              style={{ color: "white", background: "none", borderRadius: 5, cursor: "pointer", backgroundColor: "#FF8001" }}
            >
              Show Tracks
            </button>
            {tracks[album.id] && showTracks[album.id] && (
              <p style={styles.albumTracks}>
                {filteredTracks(album.id).map((track: Track) => (
                  <li key={track.id}>{track.name} ({track.duration}s) - {track.artist}</li>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
    </ScrollView>
  );
}

/* ----- Styles ----- */

const styles = StyleSheet.create({
  header: {
    fontFamily: "Arial",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchCard: {
    backgroundColor: "#FF8001",
    color: "white",
    padding: 8,
    borderRadius: "4px",
    marginTop: 8,
    width: "100%",
    cursor: "pointer",
  },
  newReleasesCard: {
    backgroundColor: "#222",
    color: "white",
    padding: 8,
    borderRadius: "4px",
    marginTop: 8,
    width: "100%",
    cursor: "pointer",
  },
  albumCard: {
    backgroundColor: "#222",
    borderRadius: 10,
    alignItems: "center",
  },
  albumName: {
    fontSize: 16,
    fontFamily: "Arial",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingTop: 8,
  },
  albumTracks: {
    fontSize: 14,
    fontFamily: "Arial",
    color: "#fff",
    marginTop: 8,
    paddingLeft: 8,
    paddingBottom: 8,
  },
});