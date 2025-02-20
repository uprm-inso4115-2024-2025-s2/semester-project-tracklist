/*
Para generar un accessToken hay que correr el siguiente commando en el terminal asi tal y como esta:

curl -X POST -H "Authorization: Basic $(echo -n '899865a744694fe5908c835fa65e5843:6b5716f9b00b4614902a0a4e85cee4ea' | base64)" \
    -d "grant_type=client_credentials" \
    https://accounts.spotify.com/api/token
*/


//La funcion fetchSpotifyPlaylist esta corriendo en app>index.ts
export async function fetchSpotifyPlaylist(playlistId: string , accessToken: string) {
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
        //console.log("Fetched Playlist Data:", data); // Log the entire data for debugging
        return data;
    } catch (error) {
        console.error("Failed to fetch playlist:", error);
        return null;
    }
}
