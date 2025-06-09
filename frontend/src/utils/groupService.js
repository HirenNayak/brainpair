
import { db, rtdb, auth } from "../firebase/firebase-config";
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, push } from "firebase/database";

// Create a new group
export const createGroup = async (groupName) => {
  const groupRef = await addDoc(collection(db, "groups"), {
    groupName,
    createdBy: auth.currentUser.uid,
    members: [auth.currentUser.uid],
    createdAt: new Date()
  });
  return groupRef.id;
};

// Fetch all groups
export const fetchGroups = async () => {
  const querySnapshot = await getDocs(collection(db, "groups"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Join a group
export const joinGroup = async (groupId) => {
  const groupDoc = doc(db, "groups", groupId);
  await updateDoc(groupDoc, {
    members: arrayUnion(auth.currentUser.uid)
  });
};

// Send message to group
export const sendGroupMessage = async (groupId, text) => {
  const msgRef = ref(rtdb, `groupChats/${groupId}/messages`);
  await push(msgRef, {
    senderId: auth.currentUser.uid,
    text,
    timestamp: Date.now()
  });
};
