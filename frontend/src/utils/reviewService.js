import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebase-config";


export const submitReview = async (currentUserId, targetUserId, rating, comment) => {
  const review = {
    from: currentUserId,
    rating,
    comment,
    timestamp: new Date()
  };

  await updateDoc(doc(db, "users", targetUserId), {
    reviews: arrayUnion(review)
  });
};

// Check if currentUser already reviewed targetUser
export const hasReviewed = async (currentUserId, targetUserId) => {
  const userDoc = await getDoc(doc(db, "users", targetUserId));
  const data = userDoc.exists() ? userDoc.data() : null;
  const reviews = data?.reviews || [];
  return reviews.some(r => r.from === currentUserId);
};
