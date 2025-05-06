import React, { useEffect ,useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase-config";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import ChatWindow from "../components/ChatWindow";


function ChatPage() {

    const currentUser = auth.currentUser;

    const [matchedUsers, setMatchedUsers]  = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);


    //Only matched users 
    useEffect(() => {
        if (!currentUser) return;
      
        const fetchMatchedUsers = async () => {
          try {
            const snapshot = await getDocs(collection(db, "users"));
            const users = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              const matchedWith = data.matches || [];
              if (doc.id !== currentUser.uid && matchedWith.includes(currentUser.uid)) {
                users.push({ id: doc.id, ...data });
              }
            });
            setMatchedUsers(users);
          } catch (err) {
            console.error("Error fetching matched users: ", err);
          }
        };
      
        fetchMatchedUsers();
      }, [currentUser]);

            
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
                    <li><Link to="/timer" className="hover:underline">Pomodoro Timer</Link></li>
                    <li><Link to="/chat" className="hover:underline">Chat</Link></li>
                    <li><Link to="/profile-setting" className="hover:underline">Profile Setting</Link></li>
                </ul>
                <div className="mt-10">
                    <Button onClick={() => console.log ('Logout')} >Logout</Button>
                </div>
            </div>

            {/* MIDDLE: USER LIST */}
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Matched Users</h3>
          {matchedUsers.map((user) => (
            <div

              key={user.id}
              className={`cursor-pointer p-3 mb-2 rounded-lg shadow-md bg-white hover:bg-indigo-100 ${
                selectedUser?.id === user.id ? "border border-indigo-400" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-600">{user.course} @ {user.university}</p>
            </div>
          ))}
        </div>


       {/* RIGHT: CHAT WINDOW */}

        <div className="w-3/5 p-4">
          {selectedUser ? (
            <ChatWindow selectedUser={selectedUser} />
          ) : (
            <div className="text-center text-gray-400 mt-40">
              <p>Select a user from the left to start chatting.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
     </>
    );
}
export default ChatPage;