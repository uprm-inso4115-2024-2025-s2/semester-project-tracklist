import React, { useState, useEffect } from 'react';
import './HomePage.css'; // CSS for styling

// Mock data structure (replace with Spotify API data)
interface Song {
  cover: string;
  name: string;
  artist: string;
  date: string;
}

const HomePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'songs' | 'reviews'>('songs');
  const [songs, setSongs] = useState<Song[]>([]);

  // Fetch songs from Spotify API (mock implementation for now)
  useEffect(() => {
    // Replace this with actual Spotify API call
    const mockSongs: Song[] = [
      { cover: 'https://via.placeholder.com/150', name: 'Vida Rockstar', artist: 'JHAYCO', date: '2024' },
      { cover: 'https://via.placeholder.com/150', name: 'Viene BASQUIAT', artist: 'JHAYCO', date: '2024' },
      { cover: 'https://via.placeholder.com/150', name: 'Muri', artist: 'JHAYCO', date: '2024' },
      { cover: 'https://via.placeholder.com/150', name: '100 Gramos', artist: 'JHAYCO', date: '2024' },
    ];
    setSongs(mockSongs);
  }, []);

  return (
    <div className="home-page">
      {/* Top Section: Tracklist Title */}
      <h1 className="tracklist-title">Tracklist</h1>

      {/* Tab Selection Row */}
      <div className="tab-row">
        <button
          className={`tab-button ${selectedTab === 'songs' ? 'active' : ''}`}
          onClick={() => setSelectedTab('songs')}
        >
          Songs
        </button>
        <button
          className={`tab-button ${selectedTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setSelectedTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {/* Popular This Week Section */}
      {selectedTab === 'songs' && (
        <div className="popular-section">
          <h2>Popular this week</h2>
        </div>
      )}

      {/* Content Section */}
      <div className="content">
        {selectedTab === 'songs' && (
          <div className="song-list">
            {songs.map((song, index) => (
              <div key={index} className="song-card">
                <img src={song.cover} alt={song.name} className="song-cover" />
                <div className="song-details">
                  <h3 className="song-name">{song.name}</h3>
                  <p className="song-artist">{song.artist}</p>
                  <p className="song-date">{song.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedTab === 'reviews' && (
          <div className="reviews-section">
            {/* Placeholder for reviews content */}
            <p>Reviews content goes here.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="nav-bar">
        <button className="nav-button profile-button">Profile</button>
        <button className="nav-button music-button">🎵</button>
        <button className="nav-button search-button">Search</button>
      </div>
    </div>
  );
};

export default HomePage;