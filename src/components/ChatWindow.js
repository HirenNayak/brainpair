import React, { useState } from "react";
import {
    collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";

function ChatWindow ({ selectedUser}){
    const [text, setText] = useState("");

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