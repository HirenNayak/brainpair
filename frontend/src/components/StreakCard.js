import React from "react";

const StreakCard = ({ current, longest }) => (
  <div className="p-4 bg-indigo-100 rounded-xl shadow-md text-center">
    <h2 className="text-2xl font-bold mb-2">📅 Study Streak</h2>
    <p className="text-lg font-semibold mb-1">🔥 Current Streak: {current} {current === 1 ? "day" : "days"}</p>
    <p className="text-md">🏆 Longest Streak: {longest} {longest === 1 ? "day" : "days"}</p>
  </div>
);

export default StreakCard;
