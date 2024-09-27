import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [songDetails, setSongDetails] = useState(null);
  const [error, setError] = useState("");
  const rapidApiKey = "d33b2da361msh306a82ab316e56cp1b6e4djsnda6c1a435eb6";

  // Search for tracks and artists
  const handleSearch = async (e) => {
    e.preventDefault();

    const searchOptions = {
      method: "GET",
      url: "https://spotify23.p.rapidapi.com/search/",
      params: {
        q: query,
        type: "track,artist",
        offset: "0",
        limit: "10",
      },
      headers: {
        "X-RapidAPI-Key": "d33b2da361msh306a82ab316e56cp1b6e4djsnda6c1a435eb6",
        "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(searchOptions);
      setResults(response.data.tracks.items);
    } catch (error) {
      setError("Failed to fetch music data");
      console.error(error);
    }
  };

  // Fetch song details by track ID
  const fetchSongDetails = async (trackId) => {
    const songDetailsOptions = {
      method: "GET",
      url: "https://spotify23.p.rapidapi.com/tracks/",
      params: { ids: trackId },
      headers: {
        "X-RapidAPI-Key": "d33b2da361msh306a82ab316e56cp1b6e4djsnda6c1a435eb6",
        "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(songDetailsOptions);
      setSongDetails(response.data.tracks[0]); // Store the song details
    } catch (error) {
      console.error("Error fetching song details:", error);
    }
  };

  // Fetch albums for an artist by artist ID
  const fetchAlbumsByArtist = async (artistId) => {
    const albumOptions = {
      method: "GET",
      url: "https://spotify23.p.rapidapi.com/artist_albums/",
      params: {
        id: artistId,
        offset: "0",
        limit: "10",
      },
      headers: {
        "X-RapidAPI-Key": "d33b2da361msh306a82ab316e56cp1b6e4djsnda6c1a435eb6",
        "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(albumOptions);
      setAlbums(response.data.items);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  // Fetch top tracks for an artist by artist ID
  const fetchTopTracksByArtist = async (artistId) => {
    const topTracksOptions = {
      method: "GET",
      url: "https://spotify23.p.rapidapi.com/artist_top_tracks/",
      params: { id: artistId },
      headers: {
        "X-RapidAPI-Key": "d33b2da361msh306a82ab316e56cp1b6e4djsnda6c1a435eb6",
        "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(topTracksOptions);
      setTopTracks(response.data.tracks);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  // Fetch related artists for an artist by artist ID
  const fetchRelatedArtistsByArtist = async (artistId) => {
    const relatedArtistsOptions = {
      method: "GET",
      url: "https://spotify23.p.rapidapi.com/artist_related/",
      params: { id: artistId },
      headers: {
        "X-RapidAPI-Key": "d33b2da361msh306a82ab316e56cp1b6e4djsnda6c1a435eb6",
        "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(relatedArtistsOptions);
      setRelatedArtists(response.data.artists);
    } catch (error) {
      console.error("Error fetching related artists:", error);
    }
  };

  // Handle clicking on a song to fetch its details
  const handleSongClick = (trackId) => {
    fetchSongDetails(trackId);
  };

  // Handle clicking on an artist to fetch related data
  const handleArtistClick = (artist) => {
    fetchAlbumsByArtist(artist.id);
    fetchTopTracksByArtist(artist.id);
    fetchRelatedArtistsByArtist(artist.id);
  };

  return (
    <div className="App">
      <h1>Spotify Music Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for songs or artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        {results.length > 0 &&
          results.map((item, index) => (
            <div
              key={index}
              className="result-card"
              onClick={() => handleSongClick(item.data.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={item.data.albumOfTrack.coverArt.sources[0].url}
                alt={item.data.name}
              />
              <h2>{item.data.name}</h2>
              <p>
                {item.data.artists.items
                  .map((artist) => artist.profile.name)
                  .join(", ")}
              </p>
            </div>
          ))}
      </div>
      {/* Display song details */}
      {songDetails && (
        <div className="song-details">
          <h2>{songDetails.name}</h2>
          <p>
            Artist:{" "}
            {songDetails.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p>Album: {songDetails.album.name}</p>
          <p>Release Date: {songDetails.album.release_date}</p>
          <img src={songDetails.album.images[0].url} alt={songDetails.name} />
        </div>
      )}
      {/* Display albums by artist */}
      {albums.length > 0 && (
        <div>
          <h2>Albums by Artist</h2>
          <div className="results">
            {albums.map((album, index) => (
              <div key={index} className="result-card">
                <img src={album.images[0].url} alt={album.name} />
                <h3>{album.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Display top tracks */}
      {topTracks.length > 0 && (
        <div>
          <h2>Top Tracks</h2>
          <div className="results">
            {topTracks.map((track, index) => (
              <div key={index} className="result-card">
                <img src={track.album.images[0].url} alt={track.name} />
                <h3>{track.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Display related artists */}
      {relatedArtists.length > 0 && (
        <div>
          <h2>Related Artists</h2>
          <div className="results">
            {relatedArtists.map((artist, index) => (
              <div
                key={index}
                className="result-card"
                onClick={() => handleArtistClick(artist)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={artist.visuals.avatarImage.sources[0].url}
                  alt={artist.name}
                />
                <h3>{artist.profile.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
