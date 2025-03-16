import axios from "axios";

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET;
const TOKEN_URL = process.env.EXPO_PUBLIC_SPOTIFY_TOKEN_URL as string;

if (!CLIENT_ID || !CLIENT_SECRET || !TOKEN_URL) {
  throw new Error("Missing Spotify API credentials");
}

export const fetchToken = async () => {
  try {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID as string,
        client_secret: CLIENT_SECRET as string,
      }).toString(), 
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};
