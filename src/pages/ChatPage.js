import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import ChatWindow from "../components/ChatWindow";

function ChatPage() {
    return (
        <>
        <Header />
        <div className="flex min-h-screen pt-16">
            {/* Silde Bar */}
            <div className="w-1/5 bg-teal-500 text-white p-6">
                <h2 className="text-2xl font-bold mb-8">BrainPair</h2>
                <ul className="space-y-4">
                    <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
                    <li><Link to="/matches" className="hover:underline">Matches</Link></li>
                    <li><Link to="/timer" className="hover:underline">Timer</Link></li>
                    <li><Link to="/chat" className="hover:underline">Chat</Link></li>
                    <li><Link to="/profile-setting" className="hover:underline">Profile Setting</Link></li>
                </ul>
                <div className="mt-10">
                    <Button onClick={() => console.log ('Logout')} >Logout</Button>
                </div>
            </div>
            {/*Matched Users*/}
            <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
                <h3 className="text-lg font-bold mb-4 text-gray-700">Matched Users</h3>
                {/* PlaceHolder for now */}
                <p className="text-gray-500">No matched users loaded yet...</p>
            </div>
            {/* Chat window placehoder */}
            <div className="w-3/5 p-4">
                <div className="text-center text-gray-400 mt-40">
                    <p>Select a user from the left to start chatting.</p>
                </div>

            </div>
        </div>
        </>
    );
}
export default ChatPage;