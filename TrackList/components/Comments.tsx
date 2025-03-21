import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Comment {
  id: string;
  username: string;
  comment: string;
}

const COMMENTS_DATA: Comment[] = [
  {
    id: "1",
    username: "Arrozconhabichuelas123",
    comment: "I agree with your statement homeboy",
  },
  {
    id: "2",
    username: "holamellamo",
    comment: "Very very good",
  },
  {
    id: "3",
    username: "nomellamo",
    comment: "true but not true",
  },
  {
    id: "4",
    username: "jola",
    comment: "yeah but it doesnt really matter",
  },
  {
    id: "5",
    username: "thebestrice",
    comment: "I agree with you completely",
  },
];

export default function CommentsScreen() {
  return (
    // SafeAreaView helps avoid the notch/status bar on iOS,
    // but you can remove it if you truly want no default spacing at all.
    <SafeAreaView style={styles.container}>
      {/* Force the status bar to be hidden or styled to your preference */}
      <StatusBar hidden />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>5 comments</Text>
      </View>

      {/* List of Comments */}
      <FlatList
        data={COMMENTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Ionicons
              name="person-circle-outline"
              size={32}
              color="#000"
              style={styles.commentIcon}
            />
            <View style={styles.commentTextContainer}>
              <Text style={styles.commentUsername}>{item.username}</Text>
              <Text style={styles.commentBody}>{item.comment}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#f58220",
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  commentIcon: {
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  commentBody: {
    fontSize: 14,
    color: "#333",
  },
});
