// src/components/MatchCelebrationModal.js
import React from "react";
import Confetti from "react-confetti";
import Button from "./Button";

const MatchCelebrationModal = ({ isOpen, onClose, matchedUser, currentUser }) => {
  if (!isOpen || !matchedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <Confetti width={window.innerWidth} height={window.innerHeight} />

      <div className="bg-white p-8 rounded-2xl text-center max-w-md shadow-lg z-50">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">🎉 It's a Match!</h2>
        <p className="text-gray-700 mb-6">You and {matchedUser.firstName} liked each other</p>

        <div className="flex justify-center gap-6 mb-6">
          <img
            src={currentUser?.photoURL || "/default-user.png"}
            alt="You"
            className="w-24 h-24 rounded-full object-cover shadow-md"
          />
          <img
            src={matchedUser?.images?.[0] || "/default-user.png"}
            alt={matchedUser.firstName}
            className="w-24 h-24 rounded-full object-cover shadow-md"
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => {
              onClose();
              window.location.href = `/chat/${matchedUser.uid}`;
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            💬 Start Chat
          </Button>
          <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
            ❌ Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchCelebrationModal;
