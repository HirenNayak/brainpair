import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import dayjs from "dayjs";

export const updateStreak = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const today = dayjs().format("YYYY-MM-DD");

  let streak = userSnap.exists() ? userSnap.data().streak || {} : {};
  const last = dayjs(streak.lastActive || null);
  const diff = last.isValid() ? dayjs(today).diff(last, "day") : null;

  if (diff === 0) return; // Already updated today
  if (diff === 1) {
    // Continued streak
    streak.current = (streak.current || 0) + 1;
    streak.dates = [...(streak.dates || []), today];
  } else {
    // Streak broken
    streak.current = 1;
    streak.dates = [today];
  }

  streak.lastActive = today;
  streak.longest = Math.max(streak.longest || 0, streak.current);

  await updateDoc(userRef, { streak });
};
