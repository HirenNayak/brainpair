import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, rtdb, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { ref, push, onValue } from "firebase/database";
import { toast } from "react-toastify"; // ✅ Toast added

const ChatPage = () => {
  const { userId } = useParams();
  const [matchList, setMatchList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

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
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

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
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="font-bold text-lg text-indigo-700 mb-4">Connections</h2>
        {matchList.map((user) => (
          <div
            key={user.uid}
            className={`p-2 rounded cursor-pointer mb-2 ${
              selectedUser?.uid === user.uid
                ? "bg-indigo-100"
                : "hover:bg-indigo-50"
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {user.firstName}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
          Chat with {selectedUser?.firstName || "someone"}
        </h2>
        <div className="bg-white rounded shadow p-4 h-[400px] overflow-y-auto mb-4">
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
                    ? "bg-indigo-200"
                    : "bg-gray-200"
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
            className="flex-1 border border-gray-300 rounded px-4 py-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
