import { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, rtdb, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onChildAdded, ref } from "firebase/database";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const MessageListener = () => {
  const location = useLocation();
  const shownMessages = useRef(new Set()); // track shown message IDs
  const initialKeys = useRef(new Set());   // track messages already present

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

      matched.forEach(({ matchId, otherId }) => {
        const msgRef = ref(rtdb, `messages/${matchId}`);

        // Step 1: preload existing messages so we don’t notify for them
        const preload = (snapshot) => {
          const data = snapshot.val();
          if (data) {
            Object.keys(data).forEach((key) => initialKeys.current.add(key));
          }
        };

        // Use a separate ref to avoid double-triggering
        rtdb.ref(`messages/${matchId}`).once("value", preload);

        // Step 2: listen for *new* messages
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
      });
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) setupListeners(user);
    });

    return () => {
      unsubscribeAuth();
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [location]);

  return null;
};

export default MessageListener;
