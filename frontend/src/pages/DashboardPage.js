import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("matches");

  return (
    <>
      <Header />

      <div className="min-h-screen bg-indigo-50 flex">
        {/* Sidebar */}
        <div className="w-60 bg-white shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-600">Dashboard</h2>
          <ul className="space-y-3">
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "matches"
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("matches")}
              >
                Matches
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "messages"
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("messages")}
              >
                Messages
              </button>
            </li>
            {/* Add more sections here if needed */}
          </ul>
        </div>

        {/* Main View */}
        <div className="flex-1 p-8">
          {activeTab === "matches" && (
            <div>
              <h1 className="text-2xl font-bold text-indigo-700 mb-4">Your Matches</h1>
              {/* Matches content will go here */}
              <p className="text-gray-600">Coming soon: Swipe and match system...</p>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h1 className="text-2xl font-bold text-indigo-700 mb-4">Messages</h1>
              {/* Messages content will go here */}
              <p className="text-gray-600">Chat functionality under development.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DashboardPage;
