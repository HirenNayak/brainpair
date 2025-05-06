import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import Slider from "react-slick";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const matchesSnapshot = await getDocs(collection(db, "matches"));
      const connectedUserIds = [];

      matchesSnapshot.forEach((matchDoc) => {
        const match = matchDoc.data();
        if (match.users.includes(currentUser.uid)) {
          const otherUserId = match.users.find((id) => id !== currentUser.uid);
          connectedUserIds.push({ uid: otherUserId, matchId: matchDoc.id });
        }
      });

      const userData = [];
      for (const entry of connectedUserIds) {
        const userDoc = await getDoc(doc(db, "users", entry.uid));
        if (userDoc.exists()) {
          userData.push({
            uid: entry.uid,
            matchId: entry.matchId,
            ...userDoc.data(),
          });
        }
      }

      setConnections(userData);
    };

    fetchConnections();
  }, []);

  const handleUnmatch = async (matchId) => {
    await deleteDoc(doc(db, "matches", matchId));
    setConnections((prev) => prev.filter((conn) => conn.matchId !== matchId));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {connections.map((user) => (
        <div key={user.uid} className="bg-white shadow-lg rounded-lg p-6 text-center">
          <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
            {user.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Profile ${i}`}
                className="rounded-xl w-full h-64 object-cover mb-4"
              />
            ))}
          </Slider>
          <h2 className="text-xl font-bold text-indigo-700">
            {user.firstName} ({user.city})
          </h2>
          <p className="text-gray-600">
            {user.interest1}, {user.interest2}
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={() => navigate(`/chat/${user.uid}?matchId=${user.matchId}`)}
            >
              Chat
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={() => handleUnmatch(user.matchId)}
            >
              Unmatch
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectionsPage;
