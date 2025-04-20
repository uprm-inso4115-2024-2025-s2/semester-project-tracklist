import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from 'react-native-safe-area-context';

interface ReviewFormProps {
  posterUrl?: string;
  title: string;
  year: number;
  onSubmit: (review: ReviewData) => void;
  onCancel?: () => void; 
}

interface ReviewData {
  dateWatched: Date;
  rating: number;
  liked: boolean;
  reviewText: string;
  tags: string[];
  firstTime: boolean;
  noSpoilers: boolean;
  canReply: boolean;
}

export default function LetterboxdStyleReviewForm({
  posterUrl,
  title,
  year,
  onSubmit,
  onCancel
}: ReviewFormProps) {
  const [dateWatched, setDateWatched] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [firstTime, setFirstTime] = useState(true);
  const [noSpoilers, setNoSpoilers] = useState(false);
  const [canReply, setCanReply] = useState(true);

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleStarPress = (value: number) => {
    setRating(value);
  };

  const submitReview = () => {
    if (!rating || !reviewText.trim()) return;
    onSubmit({
      dateWatched,
      rating,
      liked,
      reviewText: reviewText.trim(),
      tags,
      firstTime,
      noSpoilers,
      canReply,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 12, }}>
        {/* Top Navigation Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={{ color: "#007aff", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={submitReview} disabled={!reviewText || rating === 0}>
            <Text style={{ color: !reviewText || rating === 0 ? "gray" : "#007aff", fontSize: 16 }}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Add song info */}
        {posterUrl && (
          <Image source={{ uri: posterUrl }} style={{ width: 100, height: 150, borderRadius: 8 }} />
        )}
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{title} {year}</Text>

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
          <Text style={{ color: "#333" }}>Date</Text>
          <Text style={{ fontSize: 16, color: "#666" }}>
            {dateWatched.toLocaleDateString(Platform.OS === "ios" ? "en-US" : "en-GB")}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateWatched}
            mode="date"
            display="default"
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDateWatched(selectedDate);
            }}
          />
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 }}>
          <View style={{ flexDirection: "column", gap: 8 }}>
            <Text>Rate</Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {[1, 2, 3, 4, 5].map((val) => (
                <TouchableOpacity key={val} onPress={() => handleStarPress(val)}>
                  <Icon name={val <= rating ? "star" : "star-outline"} size={32} color="#f4c10f" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Text>Like</Text>
            <TouchableOpacity onPress={() => setLiked(!liked)}>
              <Icon name={liked ? "heart" : "heart-outline"} size={28} color={liked ? "red" : "gray"} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={{flexDirection: "column", gap: 8, paddingVertical: 8}}>
          <Text>Review</Text>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="Add review..."
            multiline
            numberOfLines={4}
            style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 6, padding: 8 }}
          />
        </View>
        <View style={{ flexDirection: "column", gap: 8, paddingVertical: 8 }}>
          <Text>Add tags</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="e.g. epic, funny"
              style={{ flex: 1, borderColor: "#ccc", borderWidth: 1, borderRadius: 6, padding: 8 }}
            />
            <Button title="Add" onPress={handleTagAdd} />
          </View>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {tags.map((tag) => (
            <Text
              key={tag}
              style={{ backgroundColor: "#eee", padding: 6, borderRadius: 12 }}
              onPress={() => handleTagRemove(tag)}
            >
              {tag} ✕
            </Text>
          ))}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text>Anyone can reply</Text>
          <Switch value={canReply} onValueChange={setCanReply} />
        </View>
      </View>
    </SafeAreaView>
  );
}