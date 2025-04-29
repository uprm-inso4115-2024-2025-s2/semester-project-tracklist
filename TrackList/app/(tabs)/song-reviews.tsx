// components/SongReviews.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ReviewCard from "@/components/ReviewCard";
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from "@/firebaseConfig"
interface Review {
  id: string;
  username: string;
  rating: number;
  userId: string;
  reviewText: string;
  timestamp: string;
  liked?: boolean;
  profileImage?: string;
}

interface SongReviewsProps {
  trackId: string;
}

const SongReviews: React.FC<SongReviewsProps> = ({ trackId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'everyone' | 'you'>('everyone');
  const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
  const currentUser = auth.currentUser;
  setUserId(currentUser?.uid ?? null);
}, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const dummyReviews: Review[] = [
        {
          id: "1",
          username: "SilentDawn",
          rating: 5,
          userId: "user1",
          reviewText: "Assimilation is a threat to the binding ties of community...",
          timestamp: "1d ago",
          liked: true,
        },
        {
          id: "2",
          username: "zoë rose bryant",
          rating: 5,
          userId: "user2",
          reviewText: "when i worship in the name of the lord this weekend...",
          timestamp: "2d ago",
          liked: true,
        },
        {
          id: "3",
          username: "Brett Arnold",
          rating: 3.5,
          userId: "user3",
          reviewText: "Nobody’s ready for how much talk there is about...",
          timestamp: "3d ago",
          liked: true,
        },
        {
          id: "4",
          username: "jer",
          rating: 4.5,
          userId: "user4",
          reviewText: "vampires be like 'i’m fighting demons' and the demons...",
          timestamp: "5d ago",
          liked: true,
        },
        {
          id: "5",
          username: "Jessy",
          rating: 4,
          userId: userId || "user5",
          reviewText: "I love this song! It really speaks to me.",
          timestamp: "1w ago",
          liked: false,
        },
      ];
      setTimeout(() => {
        setReviews(dummyReviews);
        setLoading(false);
      }, 1000);
    };
    fetchReviews();
  }, [trackId]);

  const filteredReviews = reviews.filter((review) => {
    if (filter === "you" && userId) {
      return review.userId === userId;
    }
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fdfdfd" }}>
      <View style={{ paddingHorizontal: 16, paddingBottom: 12, backgroundColor: "#fdfdfd", flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>Reviews</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, backgroundColor: "#eee" }}>
        {['everyone', 'you'].map((item) => (
          <TouchableOpacity key={item} onPress={() => setFilter(item as any)}>
            <Text style={{ color: filter === item ? '#000' : '#888', fontWeight: filter === item ? 'bold' : 'normal' }}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ padding: 16, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#999" />
        ) : filteredReviews.length === 0 ? (
          <Text style={{ color: "#888" }}>No reviews yet – be the first to write one!</Text>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              username={review.username}
              rating={review.rating}
              reviewText={review.reviewText}
              timestamp={review.timestamp}
              liked={review.liked}
              profileImage={review.profileImage}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SongReviews;