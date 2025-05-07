import { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, rtdb, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onChildAdded, ref } from "firebase/database";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const MessageListener = () => {
  const location = useLocation();
  const shownMessages = useRef(new Set()); // ✅ track shown messages

  useEffect(() => {
    let unsubscribes = [];

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
        const unsub = onChildAdded(msgRef, async (snapshot) => {
          const msg = snapshot.val();
          const messageId = snapshot.key;

          // ✅ Only notify if it's a new, unseen message
          if (
            msg.sender !== user.uid &&
            !shownMessages.current.has(messageId) &&
            !location.pathname.includes(`/chat/${otherId}`)
          ) {
            shownMessages.current.add(messageId); // ✅ mark as seen

            const userDoc = await getDoc(doc(db, "users", otherId));
            const name = userDoc.exists() ? userDoc.data().firstName : "Someone";
            toast.info(`${name} sent you a message! 💬`);
          }
        });
        unsubscribes.push(() => unsub());
      });
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setupListeners(user);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [location]);

  return null;
};

export default MessageListener;
