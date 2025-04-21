// src/services/firestore/reviews.ts
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const saveReview = async (review: any) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      ...review,
      createdAt: serverTimestamp(),
    });
    console.log("Review saved with ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error saving review:", error);
    throw error;
  }
};