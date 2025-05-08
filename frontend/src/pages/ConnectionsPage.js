import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import Slider from "react-slick";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [expandedUid, setExpandedUid] = useState(null);
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
          const data = userDoc.data();
          userData.push({
            uid: entry.uid,
            matchId: entry.matchId,
            ...data,
            reviews: data.reviews || [], // ✅ Ensure reviews are always an array
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

  const toggleExpand = (uid) => {
    setExpandedUid((prev) => (prev === uid ? null : uid));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {connections.map((user) => (
        <div
          key={user.uid}
          className="bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer"
          onClick={() => toggleExpand(user.uid)}
        >
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

          {expandedUid === user.uid && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg text-left text-sm text-gray-700">
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>University:</strong> {user.university}</p>
              <p><strong>Course:</strong> {user.course}</p>
              <p><strong>Availability:</strong> {user.day} from {user.startTime} to {user.endTime}</p>

              {/* ⭐ Reviews */}
              <div className="mt-4">
                <p className="font-semibold mb-1">⭐ Reviews</p>
                {user.reviews?.length > 0 ? (() => {
                  const avg = user.reviews.reduce((sum, r) => sum + r.rating, 0) / user.reviews.length;
                  const latest = [...user.reviews]
                    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
                    .slice(0, 3);
                  return (
                    <div>
                      <p className="text-gray-800 mb-2">Average Rating: ⭐ {avg.toFixed(1)}</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto text-sm text-gray-700">
                        {latest.map((r, i) => (
                          <p key={i}>⭐ {r.rating} — “{r.comment}”</p>
                        ))}
                      </div>
                    </div>
                  );
                })() : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/chat/${user.uid}?matchId=${user.matchId}`);
              }}
            >
              Chat
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleUnmatch(user.matchId);
              }}
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
