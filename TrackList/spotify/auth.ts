export const CLIENT_ID = "899865a744694fe5908c835fa65e5843";
export const CLIENT_SECRET = "6b5716f9b00b4614902a0a4e85cee4ea";
export const TOKEN_URL = "https://accounts.spotify.com/api/token";

export const fetchToken = async () => {
  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};