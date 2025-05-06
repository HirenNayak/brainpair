import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const MatchesPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const current = auth.currentUser;
      if (!current) return;

      const currentDoc = await getDoc(doc(db, "users", current.uid));
      const allDocs = await getDocs(collection(db, "users"));

      const others = [];
      allDocs.forEach((docSnap) => {
        if (docSnap.id !== current.uid) {
          others.push({ uid: docSnap.id, ...docSnap.data() });
        }
      });

      const filtered = others.filter((user) =>
        user.interest1 === currentDoc.data().interest1 ||
        user.interest2 === currentDoc.data().interest1 ||
        user.interest1 === currentDoc.data().interest2 ||
        user.interest2 === currentDoc.data().interest2
      );

      setCurrentUser({ uid: current.uid, ...currentDoc.data() });
      setAllUsers(others);
      setFilteredUsers(filtered);
    };

    fetchUsers();
  }, []);

  const handleSwipe = async (direction) => {
    const targetUser = filteredUsers[index];
    if (!targetUser) return;

    const swipeRef = doc(db, "swipes", currentUser.uid);
    const swipeData = (await getDoc(swipeRef)).data() || {};

    swipeData[targetUser.uid] = direction;
    await setDoc(swipeRef, swipeData, { merge: true });

    // Check for match
    if (direction === "right") {
      const targetSwipeRef = doc(db, "swipes", targetUser.uid);
      const targetSwipeDoc = await getDoc(targetSwipeRef);
      if (targetSwipeDoc.exists()) {
        const targetSwipes = targetSwipeDoc.data();
        if (targetSwipes[currentUser.uid] === "right") {
          const matchId = [currentUser.uid, targetUser.uid].sort().join("_");
          await setDoc(doc(db, "matches", matchId), {
            users: [currentUser.uid, targetUser.uid],
            timestamp: new Date()
          });
        }
      }
    }

    setShowDetails(false);
    setIndex(index + 1);
  };

  const currentProfile = filteredUsers[index];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-indigo-50 flex flex-col items-center py-10 px-6">
        {currentProfile ? (
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
            <img
              src={currentProfile.images?.[0]}
              alt="Profile"
              className="rounded-xl w-full h-64 object-cover mb-4"
            />
            <h2 className="text-xl font-bold text-indigo-700">
              {currentProfile.firstName} ({currentProfile.city})
            </h2>
            <p className="text-gray-600 mt-1">
              Interest match: {
                currentUser.interest1 === currentProfile.interest1 || currentUser.interest1 === currentProfile.interest2
                  ? currentUser.interest1
                  : currentUser.interest2
              }
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <Button onClick={() => handleSwipe("left")} className="bg-red-500 hover:bg-red-600">Dislike</Button>
              <Button onClick={() => setShowDetails(!showDetails)} className="bg-gray-300 text-gray-800">⋯</Button>
              <Button onClick={() => handleSwipe("right")} className="bg-green-500 hover:bg-green-600">Like</Button>
            </div>

            {showDetails && (
              <div className="mt-6 text-left bg-indigo-50 rounded-lg p-4 shadow">
                <p><strong>Name:</strong> {currentProfile.firstName}</p>
                <p><strong>City:</strong> {currentProfile.city}</p>
                <p><strong>University:</strong> {currentProfile.university}</p>
                <p><strong>Interests:</strong> {currentProfile.interest1}, {currentProfile.interest2}</p>
                <p><strong>Availability:</strong> {currentProfile.day} {currentProfile.startTime}–{currentProfile.endTime}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No more matches found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MatchesPage;
