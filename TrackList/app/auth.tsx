import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import axios from 'axios';
import { Text, View } from '@/components/Themed';

const CLIENT_ID = '899865a744694fe5908c835fa65e5843';
const CLIENT_SECRET = '6b5716f9b00b4614902a0a4e85cee4ea';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

export default function Auth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          TOKEN_URL,
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        setAccessToken(response.data.access_token);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching token:', error.response?.data || error.message);
        } else {
          console.error('Error fetching token:', (error as Error).message);
        }
      }
    };

    fetchToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotify API Authentication</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>{accessToken ? `Access Token: ${accessToken}` : 'Fetching token...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
