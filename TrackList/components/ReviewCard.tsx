// components/ReviewCard.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface ReviewCardProps {
  username: string;
  rating: number;
  reviewText: string;
  timestamp: string;
  profileImage?: string;
  liked?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  username,
  rating,
  reviewText,
  timestamp,
  profileImage,
  liked,
}) => {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: "#ccc", padding: 16, marginBottom: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map((val) => (
            <Icon
              key={val}
              name={val <= rating ? "star" : "star-outline"}
              size={18}
              color="#f4c10f"
            />
          ))}
          {liked && <FontAwesome name="heart" size={16} color="orange" style={{ marginLeft: 6 }} />}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ fontWeight: "bold", fontSize: 12 }}>{username}</Text>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 28, height: 28, borderRadius: 20, marginRight: 10 }}
            />
          ) : (
            <Icon name="person-circle" size={30} color="#ccc" style={{ marginLeft: -2, marginRight: 10 }} />
          )}
        </View>
      </View>

      <Text style={{ fontSize: 14 }}>{reviewText}</Text>
    </View>
  );
};

export default ReviewCard;
