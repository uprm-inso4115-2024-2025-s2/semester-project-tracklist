const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID?.toString() || '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET?.toString() || '';
const testPlaylistID = '37i9dQZF1DZ06evO1IPOOk';
const accessToken = getSpotifyAccessToken(CLIENT_ID, CLIENT_SECRET);

async function getSpotifyAccessToken(clientID: string, clientSecret: string) {

    const tokenUrl = "https://accounts.spotify.com/api/token";

    // Set up the form data for the request
    const body = new URLSearchParams();
    body.append("grant_type", "client_credentials");
    body.append("client_id", clientID);
    body.append("client_secret", clientSecret);

    try {
      // Make the POST request using fetch
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(), // Convert body to a URL-encoded string
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        console.log("Access Token:", token);
        return token;
      } else {
        throw new Error("Failed to fetch the token");
      }
    } catch (Error) {
      console.error("Error:", Error);
    }
}

//La funcion fetchSpotifyPlaylist esta corriendo en app>index.ts
export async function fetchSpotifyPlaylist(playlistId: string) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching playlist: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Playlist Data:", data); // Log the entire data for debugging
        return data;
    } catch (error) {
        console.error("Failed to fetch playlist:", error);
        return null;
    }
}
