import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CalendarPage = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const matchSnapshot = await getDocs(collection(db, "matches"));
      const matchedUserData = [];

      for (const matchDoc of matchSnapshot.docs) {
        const data = matchDoc.data();
        if (data.users.includes(currentUser.uid)) {
          const otherId = data.users.find((id) => id !== currentUser.uid);
          const userDoc = await getDoc(doc(db, "users", otherId));
          if (userDoc.exists()) {
            matchedUserData.push({ uid: otherId, ...userDoc.data() });
          }
        }
      }

      setMatchedUsers(matchedUserData);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading calendar...</p>;

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Matched Availability Calendar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weekdays.map((day) => (
          <div key={day} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">{day}</h2>
            {matchedUsers.filter(user => user.day === day).length === 0 ? (
              <p className="text-gray-400">No availability</p>
            ) : (
              matchedUsers
                .filter((user) => user.day === day)
                .map((user) => (
                  <div key={user.uid} className="bg-indigo-100 text-indigo-800 px-3 py-2 mb-2 rounded">
                    <p className="font-bold">{user.firstName}</p>
                    <p className="text-sm">{user.startTime} - {user.endTime}</p>
                  </div>
                ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
