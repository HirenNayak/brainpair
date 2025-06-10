import React, { useEffect, useState } from "react";
import { auth, db, rtdb } from "../firebase/firebase-config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayRemove
} from "firebase/firestore";
import { ref, push, onValue } from "firebase/database";
import { toast } from "react-toastify";

const GroupChatPage = () => {
  const currentUser = auth.currentUser;
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [myName, setMyName] = useState("Me");
  const [selectedFile, setSelectedFile] = useState(null);

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

  const getUploadUrl = (file) => {
    if (file.type.startsWith("image")) return "https://api.cloudinary.com/v1_1/dvgkrvvsv/image/upload";
    if (file.type.startsWith("video")) return "https://api.cloudinary.com/v1_1/dvgkrvvsv/video/upload";
    toast.error("Only image and video files are supported.");
    return null;
  };

  const handleSend = async () => {
    if (!text.trim() && !selectedFile) return;
    const msgRef = ref(rtdb, `groupChats/${selectedGroup.id}/messages`);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "brainpair_upload");
        formData.append("folder", `brainpair/group-files/${currentUser.uid}`);
        formData.append("public_id", `group_${currentUser.uid}_${Date.now()}`);

        const uploadUrl = getUploadUrl(selectedFile);
        if (!uploadUrl) return;

        const res = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          await push(msgRef, {
            senderId: currentUser.uid,
            senderName: myName,
            fileUrl: data.secure_url,
            fileType: selectedFile.type,
            timestamp: Date.now(),
          });
          setSelectedFile(null);
        }
      }

      if (text.trim()) {
        await push(msgRef, {
          senderId: currentUser.uid,
          senderName: myName,
          text,
          timestamp: Date.now(),
        });
        setText("");
      }
    } catch (err) {
      toast.error("Error sending message.");
      console.error(err);
    }
  };

  const handleLeaveGroup = async () => {
    const confirmLeave = window.confirm("Are you sure you want to leave this group?");
    if (!confirmLeave) return;

    await updateDoc(doc(db, "groups", selectedGroup.id), {
      members: arrayRemove(currentUser.uid),
    });

    const snapshot = await getDocs(collection(db, "groups"));
    const updatedGroups = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(group => group.members.includes(currentUser.uid));
    setGroups(updatedGroups);
    setSelectedGroup(null);
    setMessages([]);
  };

  return (
    <div className="flex h-screen overflow-hidden">
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

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
          {selectedGroup ? (
            <>
              <div>
                <h2 className="text-lg font-semibold">{selectedGroup.groupName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedGroup.description || "No description available."}
                </p>
              </div>
              <button
                onClick={handleLeaveGroup}
                className="text-red-600 hover:underline text-sm ml-4"
              >
                Leave Group
              </button>
            </>
          ) : (
            <h2 className="text-lg font-semibold">Select a group to chat</h2>
          )}
        </div>

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
                      {msg.fileUrl ? (
                        msg.fileType?.startsWith("image") ? (
                          <img src={msg.fileUrl} alt="uploaded" className="rounded w-full" />
                        ) : msg.fileType?.startsWith("video") ? (
                          <video controls className="rounded w-full">
                            <source src={msg.fileUrl} type={msg.fileType} />
                          </video>
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            📎 View or Download File
                          </a>
                        )
                      ) : (
                        <span>{msg.text}</span>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              <p className="text-center text-gray-400 mt-10">
                Chat will appear here once you select a group
              </p>
            )}
          </div>

          {selectedGroup && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                className="p-2 border rounded dark:bg-gray-800"
              />
              <div className="flex gap-2 items-center">
                <label className="cursor-pointer px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                  📎 Upload File
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>
                {selectedFile && (
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {selectedFile.name} <button onClick={() => setSelectedFile(null)} className="text-red-500">✖</button>
                  </span>
                )}
                <button
                  onClick={handleSend}
                  className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage;
