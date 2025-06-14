import React, { useEffect, useState, useCallback } from "react";
import { auth, db, rtdb } from "../firebase/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { ref, push } from "firebase/database";
import { toast } from "react-toastify";

const GroupsPage = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [groups, setGroups] = useState([]);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [newName, setNewName] = useState("");
  const [emailToAdd, setEmailToAdd] = useState("");
  const [userMap, setUserMap] = useState({});
  const currentUser = auth.currentUser;

  const fetchUserGroups = useCallback(async () => {
    const snapshot = await getDocs(collection(db, "groups"));
    const filtered = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((group) => group.members.includes(currentUser.uid));
    setGroups(filtered);
  }, [currentUser]);

  const fetchUserMap = useCallback(async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const map = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      map[doc.id] = data.firstName || "Unknown";
    });
    setUserMap(map);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserGroups();
      fetchUserMap();
    }
  }, [currentUser, fetchUserGroups, fetchUserMap]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    await addDoc(collection(db, "groups"), {
      groupName,
      description,
      createdBy: currentUser.uid,
      members: [currentUser.uid],
      createdAt: new Date(),
      pendingRequests: [],
    });
    setGroupName("");
    setDescription("");
    fetchUserGroups();
    toast.success("Group created.");
  };

  const handleToggleGroup = (groupId) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  };

  const handleChangeName = async (groupId, group) => {
    if (!newName.trim()) return;
    if (group.createdBy !== currentUser.uid) {
      toast.warn("Only the group creator can change the name.");
      return;
    }
    await updateDoc(doc(db, "groups", groupId), {
      groupName: newName,
    });
    setNewName("");
    fetchUserGroups();
    toast.success("Group name updated.");
  };

  const handleAddUser = async (groupId, group) => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const userDoc = usersSnapshot.docs.find((doc) => doc.data().email === emailToAdd);
    if (!userDoc) return toast.error("User not found.");

    const userId = userDoc.id;
    if (group.members.includes(userId)) {
      toast.warn("This user is already a member.");
      return;
    }

    const senderDoc = await getDoc(doc(db, "users", currentUser.uid));
    const senderName = senderDoc.exists() ? senderDoc.data().firstName : "Someone";

    if (group.createdBy === currentUser.uid) {
      await updateDoc(doc(db, "groups", groupId), {
        members: arrayUnion(userId),
      });
      toast.success("User added.");
    } else {
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      const groupData = groupDoc.data();
      const existing = groupData.pendingRequests || [];

      const alreadyRequested = existing.some(
        (r) => r.email === emailToAdd && r.requestedBy === currentUser.uid
      );
      if (alreadyRequested) {
        toast.warn("Already requested.");
        return;
      }

      await updateDoc(doc(db, "groups", groupId), {
        pendingRequests: arrayUnion({
          requestedBy: currentUser.uid,
          requestedByName: senderName,
          email: emailToAdd,
          timestamp: new Date().toISOString(),
        }),
      });

      const msgRef = ref(rtdb, `groupChats/${groupId}/messages`);
      await push(msgRef, {
        senderId: currentUser.uid,
        senderName,
        text: `${senderName} requested to add ${emailToAdd}`,
        timestamp: Date.now(),
      });

      toast.info("Request sent to admin.");
    }

    setEmailToAdd("");
    fetchUserGroups();
  };

  const handleRemoveUser = async (groupId, userId) => {
    await updateDoc(doc(db, "groups", groupId), {
      members: arrayRemove(userId),
    });
    fetchUserGroups();
    toast.success("User removed.");
  };

  const handleLeaveGroup = async (groupId) => {
    await updateDoc(doc(db, "groups", groupId), {
      members: arrayRemove(currentUser.uid),
    });
    fetchUserGroups();
    toast.success("You left the group.");
  };

  const handleDeleteGroup = async (groupId) => {
    await deleteDoc(doc(db, "groups", groupId));
    fetchUserGroups();
    toast.success("Group deleted.");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-yellow-300">Your Groups</h1>

      <div className="mb-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Create New Group</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="p-2 border rounded w-full dark:bg-gray-700"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Group description"
            className="p-2 border rounded w-full dark:bg-gray-700"
          />
          <button
            onClick={handleCreateGroup}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Create
          </button>
        </div>
      </div>

      {groups.map((group) => (
        <div
          key={group.id}
          className="mb-6 p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-md dark:border-gray-700"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-indigo-600 dark:text-yellow-300">
                {group.groupName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {group.description || "No description"}
              </p>
            </div>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => handleToggleGroup(group.id)}
            >
              {expandedGroupId === group.id ? "Hide Options" : "Show Options"}
            </button>
          </div>

          {expandedGroupId === group.id && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New name"
                  className="p-2 border rounded dark:bg-gray-700"
                />
                <button
                  className="bg-yellow-500 text-white px-3 rounded"
                  onClick={() => handleChangeName(group.id, group)}
                >
                  Change Name
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailToAdd}
                  onChange={(e) => setEmailToAdd(e.target.value)}
                  placeholder="User email"
                  className="p-2 border rounded dark:bg-gray-700"
                />
                <button
                  className="bg-green-600 text-white px-3 rounded"
                  onClick={() => handleAddUser(group.id, group)}
                >
                  Add User
                </button>
              </div>

              <div className="text-sm">
                <p className="font-semibold mt-3 mb-1">Members:</p>
                <ul className="list-disc list-inside space-y-1">
                  {group.members.map((uid) => (
                    <li key={uid}>
                      {userMap[uid] || "Unknown"}
                      {group.createdBy === uid && " - Admin"}
                      {group.createdBy === currentUser.uid && uid !== currentUser.uid && (
                        <button
                          onClick={() => handleRemoveUser(group.id, uid)}
                          className="ml-2 text-red-500 hover:underline text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {group.createdBy === currentUser.uid &&
                group.pendingRequests?.length > 0 && (
                  <div className="text-sm mt-4">
                    <p className="font-semibold mb-1">Pending Requests:</p>
                    <ul className="list-disc list-inside space-y-2">
                      {group.pendingRequests.map((req, idx) => (
                        <li key={idx} className="ml-4">
                          {req.requestedByName} wants to add {req.email}
                          <div className="inline ml-3 space-x-2">
                            <button
                              onClick={async () => {
                                const usersSnapshot = await getDocs(collection(db, "users"));
                                const userDoc = usersSnapshot.docs.find(
                                  (doc) => doc.data().email === req.email
                                );
                                if (!userDoc) return toast.error("User not found.");

                                const userId = userDoc.id;
                                const updated = [...group.pendingRequests];
                                updated.splice(idx, 1);

                                await updateDoc(doc(db, "groups", group.id), {
                                  members: arrayUnion(userId),
                                  pendingRequests: updated,
                                });
                                toast.success(`${req.email} added to group.`);
                                fetchUserGroups();
                              }}
                              className="text-green-600 hover:underline text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={async () => {
                                const updated = [...group.pendingRequests];
                                updated.splice(idx, 1);
                                await updateDoc(doc(db, "groups", group.id), {
                                  pendingRequests: updated,
                                });
                                toast.info(`Request removed.`);
                                fetchUserGroups();
                              }}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="pt-2">
                {group.createdBy === currentUser.uid ? (
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑 Delete Group
                  </button>
                ) : (
                  <button
                    onClick={() => handleLeaveGroup(group.id)}
                    className="text-red-500 hover:underline"
                  >
                    👋 Leave Group
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupsPage;
