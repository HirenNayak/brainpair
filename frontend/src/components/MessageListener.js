import { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, rtdb, auth } from "../firebase/firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onChildAdded, ref } from "firebase/database";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const MessageListener = () => {
  const location = useLocation();
  const initTimeRef = useRef(Date.now()); // track when user loads app

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
          const msgTime = new Date(msg.timestamp).getTime();

          if (
            msg.sender !== user.uid &&
            msgTime > initTimeRef.current && // only after listener started
            !location.pathname.includes(`/chat/${otherId}`)
          ) {
            const userDoc = await getDoc(doc(db, "users", otherId));
            const name = userDoc.exists() ? userDoc.data().firstName : "Someone";
            toast.info(`${name} sent you a new message 💬`);
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
