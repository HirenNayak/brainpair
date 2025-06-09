import { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, rtdb, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onChildAdded, ref, get } from "firebase/database";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const MessageListener = () => {
  const location = useLocation();
  const shownMessages = useRef(new Set()); // ✅ track shown message IDs
  const initialKeys = useRef(new Set());   // ✅ store initially loaded messages

  useEffect(() => {
    const unsubscribes = [];

    const setupListeners = async (user) => {
      const snapshot = await getDocs(collection(db, "matches"));
      const matched = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.users.includes(user.uid)) {
          const otherId = data.users.find((u) => u !== user.uid);
          const matchId = [user.uid, otherId].sort().join("_");
          matched.push({ matchId, otherId });
        }
      });

      for (const { matchId, otherId } of matched) {
        const msgRef = ref(rtdb, `messages/${matchId}`);

        //  Step 1: Preload existing messages once
        const snapshot = await get(msgRef);
        const data = snapshot.val();
        if (data) {
          Object.keys(data).forEach((key) => initialKeys.current.add(key));
        }

        //  Step 2: Attach listener after preload
        const unsub = onChildAdded(msgRef, async (snapshot) => {
          const msg = snapshot.val();
          const messageId = snapshot.key;

          if (
            msg.sender !== user.uid &&
            !shownMessages.current.has(messageId) &&
            !initialKeys.current.has(messageId) &&
            !location.pathname.includes(`/chat/${otherId}`)
          ) {
            shownMessages.current.add(messageId);
            const userDoc = await getDoc(doc(db, "users", otherId));
            const name = userDoc.exists() ? userDoc.data().firstName : "Someone";
            toast.info(`${name} sent you a message 💬`);
          }
        });

        unsubscribes.push(() => unsub());
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) setupListeners(user);
    });

    return () => {
      unsubscribeAuth();
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [location]);

  return null; // ✅ No UI element
};

export default MessageListener;
