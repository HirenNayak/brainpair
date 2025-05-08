import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Slider from "react-slick";
import { handleSwipe } from "../utils/matchHandler";
import MatchCelebrationModal from "../components/MatchCelebrationModal";

const MatchesPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const current = auth.currentUser;
      if (!current) return;

      const currentDoc = await getDoc(doc(db, "users", current.uid));
      const swipeDoc = await getDoc(doc(db, "swipes", current.uid));
      const swipedUserIds = swipeDoc.exists() ? Object.keys(swipeDoc.data()) : [];

      const allDocs = await getDocs(collection(db, "users"));
      const others = [];
      allDocs.forEach((docSnap) => {
        if (docSnap.id !== current.uid && !swipedUserIds.includes(docSnap.id)) {
          const userData = docSnap.data();
          others.push({
            uid: docSnap.id,
            ...userData,
            reviews: userData.reviews || [],
          });
        }
      });

      const filtered = others.filter((user) =>
        user.interest1 === currentDoc.data().interest1 ||
        user.interest2 === currentDoc.data().interest1 ||
        user.interest1 === currentDoc.data().interest2 ||
        user.interest2 === currentDoc.data().interest2
      );

      setCurrentUser({ uid: current.uid, ...currentDoc.data() });
      setFilteredUsers(filtered);
    };

    fetchUsers();
  }, []);

  const currentProfile = filteredUsers[index];

  const swipe = async (direction) => {
    if (!currentUser || !currentProfile) return;
    const isMatch = await handleSwipe(currentUser, currentProfile, direction);
    setShowDetails(false);
    setIndex(index + 1);

    if (direction === "right" && isMatch) {
      setMatchedUser(currentProfile);
      setShowCelebration(true);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-indigo-50 flex flex-col items-center py-10 px-6">
        {currentProfile ? (
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
            {currentProfile.images?.length > 0 && (
              <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
                {currentProfile.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Profile ${i}`}
                    className="rounded-xl w-full h-64 object-cover mb-4"
                  />
                ))}
              </Slider>
            )}

            <h2 className="text-xl font-bold text-indigo-700">
              {currentProfile.firstName} ({currentProfile.city})
            </h2>

            {/* ⭐ Review summary on swipe card */}
            {(() => {
              const reviewCount = currentProfile.reviews?.length || 0;
              if (reviewCount === 0) {
                return <p className="text-sm text-gray-500 mt-2">⭐ 0 reviews</p>;
              }
              const avg = currentProfile.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
              return (
                <p className="text-sm text-gray-500 mt-2">
                  ⭐ {avg.toFixed(1)} ({reviewCount} review{reviewCount > 1 ? "s" : ""})
                </p>
              );
            })()}

            <p className="text-gray-600 mt-1">
              Interest match: {
                currentUser.interest1 === currentProfile.interest1 || currentUser.interest1 === currentProfile.interest2
                  ? currentUser.interest1
                  : currentUser.interest2
              }
            </p>

            <div className="flex justify-center gap-6 mt-6">
              <Button onClick={() => swipe("left")} className="bg-red-500 hover:bg-red-600">Dislike</Button>
              <Button onClick={() => setShowDetails(!showDetails)} className="bg-gray-300 text-gray-800">⋯</Button>
              <Button onClick={() => swipe("right")} className="bg-green-500 hover:bg-green-600">Like</Button>
            </div>

            {showDetails && (
              <div className="mt-6 text-left bg-indigo-50 rounded-lg p-4 shadow">
                <p><strong>Name:</strong> {currentProfile.firstName}</p>
                <p><strong>City:</strong> {currentProfile.city}</p>
                <p><strong>University:</strong> {currentProfile.university}</p>
                <p><strong>Interests:</strong> {currentProfile.interest1}, {currentProfile.interest2}</p>
                <p><strong>Availability:</strong> {currentProfile.day} {currentProfile.startTime}–{currentProfile.endTime}</p>

                {/* ⭐ Expanded review details */}
                {currentProfile.reviews?.length > 0 ? (() => {
                  const avg = currentProfile.reviews.reduce((sum, r) => sum + r.rating, 0) / currentProfile.reviews.length;
                  const recentReviews = [...currentProfile.reviews]
                    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
                    .slice(0, 3);

                  return (
                    <div className="mt-4">
                      <p><strong>Average Rating:</strong> ⭐ {avg.toFixed(1)}</p>
                      <p><strong>Recent Reviews:</strong></p>
                      <div className="max-h-32 overflow-y-auto text-sm text-gray-600 space-y-1 mt-1">
                        {recentReviews.map((r, i) => (
                          <p key={i}>⭐ {r.rating} — “{r.comment}”</p>
                        ))}
                      </div>
                    </div>
                  );
                })() : (
                  <p className="mt-4 text-sm text-gray-500">No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No more matches found.</p>
        )}
      </div>

      {showCelebration && (
        <MatchCelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          matchedUser={matchedUser}
          currentUser={currentUser}
        />
      )}

      <Footer />
    </>
  );
};

export default MatchesPage;
