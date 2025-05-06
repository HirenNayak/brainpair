import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ConnectionsPage = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const matchesRef = collection(db, "matches");
      const snapshot = await getDocs(matchesRef);

      const userMatches = [];

      for (const docSnap of snapshot.docs) {
        const matchData = docSnap.data();
        if (matchData.users.includes(currentUser.uid)) {
          const otherUserId = matchData.users.find(uid => uid !== currentUser.uid);
          const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
          if (otherUserDoc.exists()) {
            userMatches.push({ uid: otherUserId, ...otherUserDoc.data() });
          }
        }
      }

      setMatchedUsers(userMatches);
    };

    fetchConnections();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-indigo-50 p-6">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Your Connections
        </h2>

        {matchedUsers.length === 0 ? (
          <p className="text-center text-gray-500">No connections yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedUsers.map((user, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <img
                  src={user.images?.[0]}
                  alt="Profile"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-bold text-indigo-700">{user.firstName}</h3>
                <p className="text-sm text-gray-600">{user.city}</p>
                <p className="text-sm text-gray-600">
                  Interests: {user.interest1}, {user.interest2}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ConnectionsPage;
