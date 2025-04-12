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

const CommentItem = ({ comment }: { comment: Comment }) => (
  <View style={styles.commentContainer}>
    <Ionicons
      name="person-circle-outline"
      size={32}
      color="#000"
      style={styles.commentIcon}
    />
    <View style={styles.commentTextContainer}>
      <Text style={styles.commentUsername}>{comment.username}</Text>
      <Text style={styles.commentBody}>{comment.comment}</Text>
    </View>
  </View>
);


const CommentsHeader = ({ count }: { count: number }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{count} comments</Text>
  </View>
);

const CommentsList = ({ comments }: { comments: Comment[] }) => (
  <FlatList
    data={comments}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <CommentItem comment={item} />}
  />
);

export default function CommentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <CommentsHeader count={COMMENTS_DATA.length} />
      <CommentsList comments={COMMENTS_DATA} />
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
