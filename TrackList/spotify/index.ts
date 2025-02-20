// Example:
// export { default as auth } from "./auth";
// export { default as trackService } from "./trackService";
// export { default as artistService } from "./artistService";
// export { default as playlistService } from "./playlistService";

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET;
const testPlaylistID = '37i9dQZF1DZ06evO427oOs';


export async function fetchSpotifyPlaylist(playlistId: string = "37i9dQZF1DZ06evO427oOs", accessToken: string) {
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
        return data;
    } catch (error) {
        console.error("Failed to fetch playlist:", error);
        return null;
    }
}
