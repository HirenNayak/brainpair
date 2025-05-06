import React, { useEffect, useState, useRef } from "react";
import {
    collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import {auth, db} from "../firebase/firebase-config";

function ChatWindow ({ selectedUser}){

    const currentUser = auth.currentUser;
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const chatId = [currentUser.uid, selectedUser.id].sort().join("_");
    const bottomRef = useRef(null);


    useEffect(() => {
        const  q = query(
            collection(db, "chats", chatId, "messages"), orderBy("timestamp")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));
        });
        return () => unsubscribe();
    },[chatId]);
    
    useEffect (() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);
   
    const sendMessage = async() => {
        if(text.trim() == "") return;

        await addDoc(collection(db, "chats", chatId, "messages"), {
            senderId: currentUser.uid, text, timestamp: serverTimestamp(),
        });

        setText("");
    };
    
    return(

        <div className="flex flex-col h-full">
            <h3 className="text-lg font-bold mb-2 border-b pb-2">
                Chat with {selectedUser?.firstName || selectedUser.lastName}
            </h3>

            {/*messages*/}
            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                {messages.map((msg, i) => {
                    const messageTime = msg.timestamp?.toDate?.().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    const isSentByCurrentUser = msg.senderId === currentUser.uid;

                    return (
                        <div
                          key={i}
                          className={`max-w-md p-3 rounded-lg shadow-sm ${
                            isSentByCurrentUser
                              ? "bg-green-100 self-end text-right"
                              : "bg-white self-start text-left"
                          }`}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-sm text-gray-800 break-words max-w-[80%]">{msg.text}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{messageTime}</span>
                          </div>
                        </div>
                      );
                    })}
                
                <div ref={bottomRef} />
      </div>

      <div className="flex border-t pt-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600"
        >
          Send
        </button>
      </div>

        </div>
    );
}
export default ChatWindow;