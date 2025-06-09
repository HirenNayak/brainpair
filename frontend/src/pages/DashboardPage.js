import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Pomodoro from "./PomodoroTimerApp";
import MatchesPage from "./MatchesPage";
import ConnectionsPage from "./ConnectionsPage";
import ChatPage from "./ChatPage";
import UserProfileSettings from "./UserProfileSettings"; 
import CalendarPage from "./CalendarPage";
import StudyStreakPage from "./StudyStreakPage";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("matches");

  return (
    <>
      <Header />

      <div className="min-h-screen bg-indigo-50 dark:bg-gray-900 text-black dark:text-white flex">
        {/* Sidebar */}
        <div className="w-60 bg-white dark:bg-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-300">Dashboard</h2>
          <ul className="space-y-3">
            {[
              { id: "matches", label: "Matches" },
              { id: "chat", label: "Chat" },
              { id: "pomodoro", label: "Pomodoro" },
              { id: "connections", label: "Connections" },
              { id: "calendar", label: "Calendar" },
              { id: "studyStreak", label: "Study Streak" },
              { id: "settings", label: "Profile Settings" },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white font-semibold"
                      : "hover:bg-indigo-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main View */}
        <div className="flex-1 p-8">
          {activeTab === "matches" && (
            <>
              <h1 className="text-2xl font-bold text-amber-950 dark:text-yellow-300 mb-4">Matches</h1>
              <MatchesPage />
            </>
          )}

          {activeTab === "chat" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Chat</h1>
              <ChatPage />
            </>
          )}

          {activeTab === "pomodoro" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Pomodoro Timer</h1>
              <Pomodoro />
            </>
          )}

          {activeTab === "connections" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Your Connections</h1>
              <ConnectionsPage />
            </>
          )}

          {activeTab === "calendar" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Calendar</h1>
              <CalendarPage />
            </>
          )}

          {activeTab === "studyStreak" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Study Streak</h1>
              <StudyStreakPage />
            </>
          )}

          {activeTab === "settings" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Edit Your Profile</h1>
              <UserProfileSettings />
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DashboardPage;
