import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase-config";
import { updateStreak } from "../utils/streakHandler";
import StreakCard from "../components/StreakCard";
import CalendarView from "../components/CalendarView";

const StudyStreakPage = () => {
  const [streak, setStreak] = useState(null);

  const quotes = [
    "Small steps every day lead to big results.",
    "Discipline beats motivation.",
    "You don’t have to be extreme, just consistent.",
    "Keep showing up — your future self will thank you.",
    "A 1% improvement every day = 37x better in a year.",
    "Success is the sum of small efforts repeated daily.",
    "Progress, not perfection.",
    "The secret to getting ahead is getting started.",
    "Consistency is what transforms average into excellence.",
    "Winners do daily what others do occasionally.",
    "You’re not always going to feel motivated — do it anyway.",
    "It’s not about being the best. It’s about being better than yesterday.",
    "Stay consistent — your streak is your story.",
    "Show up, even when you don’t feel like it.",
    "Your habits today shape your results tomorrow."
  ];

  const todayIndex = new Date().getDate() % quotes.length;
  const dailyQuote = quotes[todayIndex];

  useEffect(() => {
    const fetchStreak = async () => {
      const user = auth.currentUser;
      if (!user) return;

      await updateStreak(user.uid);
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      const data = snap.data();
      setStreak(data.streak || { current: 0, longest: 0, dates: [] });
    };

    fetchStreak();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 text-center bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      {streak ? (
        <>
          <StreakCard current={streak.current} longest={streak.longest} />
          <CalendarView dates={streak.dates} current={streak.current} />

          <div className="mt-6 bg-yellow-100 dark:bg-yellow-300/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              💬 Today’s Quote
            </h3>
            <p className="italic text-gray-700 dark:text-gray-200">“{dailyQuote}”</p>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300">Loading...</p>
      )}
    </div>
  );
};

export default StudyStreakPage;
