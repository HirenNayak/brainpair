import React, { useEffect, useState } from "react";
import {
    collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";

function ChatWindow ({ selectedUser}){
    const currentUser = auth.currentUser;
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const chatId = [currentUser.uid, selectedUser.id].sort().join("_");
    const bottomRef = useRef(null);
    useEffect(() => {
        const  q = query(
            collection(db, "chat", chatId, "messages"), orderBy("timestamp")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));
        });
        return () => unsubscribe();
    }), [chatId];
    
   
    const sendMessage =() =>{
        console.log("sending message: ", text);
        setText("");
    };
    return(

        <div className="flex flex-col h-full">
            <h3 className="text-lg font-bold mb-2 border-b pb-2">
                Chat with {selectedUser?.firstName || "selected User"}
            </h3>
            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-400">Messages will appear here.</p>
            </div>

            <div className="flex border-t pt-2">
                <input type="text" value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message ..."
                className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none" />
                <button onClick={sendMessage} className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600">
                    Send
                </button>
            </div>

        </div>
    );
}
export default ChatWindow;