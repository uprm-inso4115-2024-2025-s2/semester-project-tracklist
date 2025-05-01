// components/SongReviews.tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "@/firebaseConfig";

interface Review {
  id: string;
  username: string;
  rating: number;
  userId: string;
  reviewText: string;
  timestamp: string;
  songTitle: string;    // added
  year: string;         // added
  liked?: boolean;
  profileImage?: any;
}

interface SongReviewsProps {
  trackId: string;
}

const SongReviews: React.FC<SongReviewsProps> = ({ trackId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch or mock
    const dummy: Review[] = [
      {
        id: '1',
        username: 'LebronJeims',
        songTitle: 'Last Dance',  // dynamic title
        year: '2025',             // dynamic year
        rating: 4,
        userId: '',
        reviewText: 'Great song!.',
        timestamp: '1d ago',
        liked: false,
        profileImage: require('../assets/images/user.jpg'),
      },
      {
        id: '2',
        username: 'KevinDurasno',
        songTitle: 'Another Hit',
        year: '2025',
        rating: 3,
        userId: '',
        reviewText: 'Was bored halfway through',
        timestamp: '2d ago',
        liked: false,
        profileImage: require('../assets/images/user.jpg'),
      },
      {
        id: '3',
        username: 'Wedede',
        songTitle: 'Ranchos',  // dynamic title
        year: '2025',             // dynamic year
        rating: 1,
        userId: '',
        reviewText: 'Horrible song!.',
        timestamp: '1d ago',
        liked: false,
        profileImage: require('../assets/images/user.jpg'),
      },
      {
        id: '4',
        username: 'Washao123',
        songTitle: 'Rumba',
        year: '2025',
        rating: 3,
        userId: '',
        reviewText: 'You need to hear to judge',
        timestamp: '2d ago',
        liked: false,
        profileImage: require('../assets/images/user.jpg'),
      },
      {
        id: '5',
        username: 'rarefindings',
        songTitle: 'Ranchos locos',  // dynamic title
        year: '2025',             // dynamic year
        rating: 4,
        userId: '',
        reviewText: 'Love this song!.',
        timestamp: '1d ago',
        liked: false,
        profileImage: require('../assets/images/user.jpg'),
      },
      {
        id: '6',
        username: 'critik_12',
        songTitle: 'Holly',
        year: '2025',
        rating: 5,
        userId: '',
        reviewText: 'I was happy all the time while hearing this',
        timestamp: '2d ago',
        liked: false,
        profileImage: require('../assets/images/user.jpg'),
      },
    ];
    setTimeout(() => { setReviews(dummy); setLoading(false); }, 500);
  }, [trackId]);

  const renderStars = (count: number) => {
    return (
      <View style={styles.starRow}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name={i < count ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
            style={styles.star}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ flex:1, justifyContent:'center' }} size="large" color="#999" />;
  }

  return (
    <ScrollView style={styles.container}>
      {reviews.map((r) => (
        <View key={r.id} style={styles.card}>
          <View style={styles.left}> 
            <Image
              source={r.profileImage}
              style={styles.avatar}
            />
          </View>
          <View style={styles.middle}>
            <Text style={styles.title}>
              {r.songTitle} <Text style={styles.date}>{r.year}</Text>
            </Text>
            {renderStars(r.rating)}
            <Text style={styles.text}>{r.reviewText}</Text>
            <TouchableOpacity>
              <Text style={styles.reply}>Reply</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.right}>
            <Text style={styles.username}>{r.username}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default SongReviews;

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  card: { flexDirection:'row', padding:12, borderBottomWidth:1, borderColor:'#ddd', alignItems:'flex-start' },
  left: { marginRight:8 },
  avatar:{ width:40, height:40, borderRadius:20, backgroundColor:'#ccc' },
  middle:{ flex:1 },
  title:{ fontSize:16, fontWeight:'bold' },
  date:{ fontWeight:'normal', color:'#666' },
  starRow:{ flexDirection:'row', marginVertical:4 },
  star:{ marginRight:2 },
  text:{ fontSize:14, marginVertical:4 },
  reply:{ color:'#007AFF', fontWeight:'bold' },
  right:{ marginLeft:8, justifyContent:'flex-start' },
  username:{ fontSize:14, fontWeight:'600' },
});
