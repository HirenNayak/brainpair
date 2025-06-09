import React, { useEffect, useState } from "react";
import { auth, db, rtdb } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { ref, push, onValue } from "firebase/database";

const GroupChatPage = () => {
  const currentUser = auth.currentUser;
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [myName, setMyName] = useState("Me");

  // Fetch groups and user's first name
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      const snapshot = await getDocs(collection(db, "groups"));
      const userGroups = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(group => group.members.includes(currentUser.uid));
      setGroups(userGroups);

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setMyName(userDoc.data().firstName || "Me");
      }
    };

    fetchData();
  }, [currentUser]);

  // Listen for messages in selected group
  useEffect(() => {
    if (!selectedGroup) return;

    const msgRef = ref(rtdb, `groupChats/${selectedGroup.id}/messages`);
    const unsubscribe = onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      const msgList = data ? Object.values(data) : [];
      setMessages(msgList.sort((a, b) => a.timestamp - b.timestamp));
    });

    return () => unsubscribe();
  }, [selectedGroup]);

  const handleSend = async () => {
    if (!text.trim() || !selectedGroup) return;
    await push(ref(rtdb, `groupChats/${selectedGroup.id}/messages`), {
      senderId: currentUser.uid,
      senderName: myName,
      text,
      timestamp: Date.now(),
    });
    setText("");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-yellow-300">Groups</h2>
        {groups.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't joined any groups yet.</p>
        ) : (
          <ul className="space-y-2">
            {groups.map((group) => (
              <li
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group);
                  setMessages([]);
                }}
                className={`cursor-pointer px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-700 ${
                  selectedGroup?.id === group.id ? "bg-indigo-200 dark:bg-indigo-700 text-white" : ""
                }`}
              >
                {group.groupName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {selectedGroup ? (
            <>
              <h2 className="text-lg font-semibold">{selectedGroup.groupName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedGroup.description || "No description available."}
              </p>
            </>
          ) : (
            <h2 className="text-lg font-semibold">Select a group to chat</h2>
          )}
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {selectedGroup ? (
              messages.length === 0 ? (
                <p className="text-sm text-gray-400">No messages yet.</p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.senderId === currentUser.uid ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.senderId === currentUser.uid
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <strong className="block mb-1">{msg.senderName || "Unknown"}</strong>
                      <span>{msg.text}</span>
                    </div>
                  </div>
                ))
              )
            ) : (
              <p className="text-center text-gray-400 mt-10">Chat will appear here once you select a group</p>
            )}
          </div>

          {/* Message Input */}
          {selectedGroup && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded dark:bg-gray-800"
              />
              <button
                onClick={handleSend}
                className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage;
