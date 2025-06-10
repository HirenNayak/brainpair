// Calendar.js with automatic weekday detection from startTime
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getWeekday = (datetimeStr) => {
  return new Date(datetimeStr).toLocaleDateString(undefined, { weekday: 'long' });
};

const Calendar = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDesc, setSessionDesc] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [studySessions, setStudySessions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

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

  const scheduleNotification = (title, time) => {
    const delay = new Date(time).getTime() - Date.now();
    if (delay > 0 && "Notification" in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          setTimeout(() => {
            new Notification("📚 Time to Study!", {
              body: `Session: ${title}`,
              icon: "/study-icon.png",
            });
            const audio = new Audio("/alarm.mp3");
            audio.play();
          }, delay);
        }
      });
    }
  };

  const saveSession = () => {
    if (sessionTitle && startTime && endTime) {
      const autoDay = getWeekday(startTime);

      const newSession = {
        day: autoDay,
        title: sessionTitle,
        description: sessionDesc,
        start: startTime,
        end: endTime,
      };

      const updatedSessions = [...studySessions];
      if (editingIndex !== null) {
        updatedSessions[editingIndex] = newSession;
        toast.success(`✏️ Session updated for ${autoDay}`);
      } else {
        updatedSessions.push(newSession);
        toast.success(`📚 Session added for ${autoDay}`);
        scheduleNotification(sessionTitle, startTime);
      }

      setStudySessions(updatedSessions);
      setSessionTitle("");
      setSessionDesc("");
      setStartTime("");
      setEndTime("");
      setShowModal(false);
      setEditingIndex(null);
    } else {
      toast.error("Please fill all fields.");
    }
  };

  const deleteSession = () => {
    if (editingIndex !== null) {
      const updatedSessions = [...studySessions];
      const removed = updatedSessions.splice(editingIndex, 1);
      setStudySessions(updatedSessions);
      toast.success(`🗑️ Deleted session: ${removed[0].title}`);
      setShowModal(false);
      setEditingIndex(null);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-black dark:text-white">Loading calendar...</p>;

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-gray-900 p-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 text-center">Your Study Calendar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weekdays.map((day) => (
          <div key={day} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-2">{day}</h2>

            {matchedUsers.filter((user) => user.day === day).length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500">No availability</p>
            ) : (
              matchedUsers
                .filter((user) => user.day === day)
                .map((user) => (
                  <div key={user.uid} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-2 mb-2 rounded">
                    <p className="font-bold">{user.firstName}</p>
                    <p className="text-sm">{user.startTime} - {user.endTime}</p>
                  </div>
                ))
            )}

            {studySessions.filter((s) => s.day === day).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Study Sessions:</h3>
                {studySessions.filter((s) => s.day === day).map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSessionTitle(s.title);
                      setSessionDesc(s.description);
                      setStartTime(s.start);
                      setEndTime(s.end);
                      setEditingIndex(studySessions.findIndex(sess => sess === s));
                      setShowModal(true);
                    }}
                    className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200 px-3 py-2 mb-2 rounded cursor-pointer hover:opacity-90"
                  >
                    <p className="font-bold">{s.title}</p>
                    <p className="text-sm italic">{s.description}</p>
                    <p className="text-sm">
                      {new Date(s.start).toLocaleDateString(undefined, {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm">
                      {new Date(s.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(s.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => { setShowModal(true); setEditingIndex(null); }} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
          Add Study Session
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editingIndex !== null ? "Edit Study Session" : "Add Study Session"}</h2>

            <label className="block text-sm font-medium mb-1">Subject</label>
            <input type="text" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} className="w-full mb-3 p-2 border rounded" placeholder="e.g. Algorithms" />

            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={sessionDesc} onChange={(e) => setSessionDesc(e.target.value)} className="w-full mb-3 p-2 border rounded" placeholder="Notes about this session" />

            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full mb-3 p-2 border rounded" />

            <label className="block text-sm font-medium mb-1">End Time</label>
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full mb-4 p-2 border rounded" />

            <div className="flex justify-between">
              {editingIndex !== null && (
                <button onClick={deleteSession} className="text-red-500 hover:underline mr-auto">Delete</button>
              )}
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:underline">Cancel</button>
              <button onClick={saveSession} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
