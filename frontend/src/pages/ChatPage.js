import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, rtdb, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { ref, push, onValue } from "firebase/database";
import { toast } from "react-toastify";
import ReviewModal from "../components/ReviewModal";

const ChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasShownReviewPrompt, setHasShownReviewPrompt] = useState(false);

  const getMatchId = (uid1, uid2) => [uid1, uid2].sort().join("_");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!currentUser) return;

      const snapshot = await getDocs(collection(db, "matches"));
      const userMatches = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.users.includes(currentUser.uid)) {
          const otherUserId = data.users.find((id) => id !== currentUser.uid);
          const userDoc = await getDoc(doc(db, "users", otherUserId));
          if (userDoc.exists()) {
            userMatches.push({ uid: otherUserId, ...userDoc.data() });
          }
        }
      }

      setMatchList(userMatches);
      const matchedFromParam = userMatches.find((u) => u.uid === userId);
      setSelectedUser(matchedFromParam || userMatches[0] || null);
    };

    fetchMatches();
  }, [currentUser, userId]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const matchId = getMatchId(currentUser.uid, selectedUser.uid);
    const msgRef = ref(rtdb, `messages/${matchId}`);

    const unsubscribe = onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      const msgs = data ? Object.values(data) : [];
      setMessages(msgs);

      if (msgs.length >= 10 && !hasShownReviewPrompt) {
        setHasShownReviewPrompt(true);
        toast.info("⭐ You can now leave a review!", { autoClose: 4000 });
      }
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser, hasShownReviewPrompt]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      toast.warning("Please enter a message.");
      return;
    }

    try {
      const matchId = getMatchId(currentUser.uid, selectedUser.uid);
      const msgRef = ref(rtdb, `messages/${matchId}`);

      await push(msgRef, {
        sender: currentUser.uid,
        text: newMessage,
        timestamp: new Date().toISOString(),
      });

      toast.success("Message sent!");
      setNewMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
        <h2 className="font-bold text-lg text-indigo-700 dark:text-indigo-300 mb-4">
          Connections
        </h2>
        {matchList.map((user) => (
          <div
            key={user.uid}
            className={`p-2 rounded cursor-pointer mb-2 ${
              selectedUser?.uid === user.uid
                ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-900 dark:text-white"
                : "hover:bg-indigo-50 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {user.firstName}
          </div>
        ))}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded w-full"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
          Chat with {selectedUser?.firstName || "someone"}
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded shadow p-4 h-[400px] overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${
                msg.sender === currentUser?.uid ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.sender === currentUser?.uid
                    ? "bg-indigo-200 dark:bg-indigo-600 text-black dark:text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-4 py-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          >
            Send
          </button>
        </div>

        {messages.length >= 10 && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            ⭐ Leave a Review
          </button>
        )}

        {showReviewModal && (
          <ReviewModal
            onClose={() => setShowReviewModal(false)}
            currentUserId={currentUser?.uid}
            targetUserId={selectedUser?.uid}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
