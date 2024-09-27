import React, { useEffect, useState } from "react";
import axios from "axios";
const SpotifyMain = () => {
  const [musicData, setMusicData] = useState(null);
  const [albums, setAlbums] = useState("");
  const [error, SetError] = useState(null);
  const GetMusic = async () => {
    const options = {
      method: "GET",
      url: "https://spotify23.p.rapidapi.com/search/",
      params: {
        q: "multi",
        type: "multi",
        offset: "0",
        limit: "10",
        numberOfTopResults: "5",
      },
      headers: {
        "x-rapidapi-key": "f48114461fmsh1c02aba6eb38357p1aa904jsn0ddbc6a0217d",
        "x-rapidapi-host": "spotify23.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setMusicData(response.data);
      console.log(response.data, "Search End-point");
    } catch (error) {
      SetError("Failed to fetch music data");
      console.error(error);
    }
  };
  // useEffect(() => {
  //   GetMusic(albums);
  // }, [albums]);

  <div>
    <h1>Spotify</h1>
    <input type="text" placeholder="Enter your song..." />
    <button onClick={() => GetMusic(albums.items)}>Get Song</button>
  </div>;
};

export default SpotifyMain;
