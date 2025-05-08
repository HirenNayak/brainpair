import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const handleSwipe = async (currentUser, targetUser, direction) => {
  const swipeRef = doc(db, "swipes", currentUser.uid);
  const swipeData = (await getDoc(swipeRef)).data() || {};

  swipeData[targetUser.uid] = direction;
  await setDoc(swipeRef, swipeData, { merge: true });

  if (direction === "right") {
    const targetSwipeRef = doc(db, "swipes", targetUser.uid);
    const targetSwipeDoc = await getDoc(targetSwipeRef);
    if (targetSwipeDoc.exists()) {
      const targetSwipes = targetSwipeDoc.data();
      if (targetSwipes[currentUser.uid] === "right") {
        const matchId = [currentUser.uid, targetUser.uid].sort().join("_");
        await setDoc(doc(db, "matches", matchId), {
          users: [currentUser.uid, targetUser.uid],
          timestamp: new Date(),
        });
        return true; // ✅ Tell MatchesPage a match happened
      }
    }
  }

  return false; // No match
};
