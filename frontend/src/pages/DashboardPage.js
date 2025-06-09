import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Pomodoro from "./PomodoroTimerApp";
import MatchesPage from "./MatchesPage";
import ConnectionsPage from "./ConnectionsPage";
import ChatPage from "./ChatPage";
import UserProfileSettings from "./UserProfileSettings"; 
import CalendarPage from "./CalendarPage";
import useStudyStreak from "../utils/userStudyStreak";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const {studyStreak, lastStudyDate, loading, message, recordStudyActivity} = useStudyStreak();

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
                  activeTab === "chat"
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("chat")}
              >
                Chat
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "pomodoro"
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("pomodoro")}
              >
                Pomodoro
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "connections"
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("connections")}
              >
                Connections
              </button>
            </li>

            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "calendar"
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("calendar")}
              >
                Calendar
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "settings"
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Profile Settings
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "studyStreak"
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "hover:bg-indigo-50"
                }`}
                onClick={() => setActiveTab("studyStreak")}
                >
                studyStreak
              </button>
            </li>
          </ul>
        </div>

        {/* Main View */}
        <div className="flex-1 p-8">
          {activeTab === "matches" && (
            <>
              <h1 className="text-2xl font-bold text-amber-950 mb-4">Matches</h1>
              <MatchesPage />
            </>
          )}

          {activeTab === "chat" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 mb-4">Chat</h1>
              <ChatPage />
            </>
          )}

          {activeTab === "pomodoro" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 mb-4">Pomodoro Timer</h1>
              <Pomodoro />
            </>
          )}

          {activeTab === "connections" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 mb-4">Your Connections</h1>
              <ConnectionsPage />
            </>
          )}

          {activeTab === "calendar" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 mb-4">Calender</h1>
              <CalendarPage />
            </>
          )}

          {activeTab === "settings" && (
            <>
              <h1 className="text-2xl font-bold text-indigo-700 mb-4">Edit Your Profile</h1>
              <UserProfileSettings />
            </>
          )}
          {activeTab === "studyStreak" && (
              <>
                <h1 className="text-2xl font-bold text-indigo-700 mb-4">Study Streak</h1>
                {loading ? (
                    <p>Loading streak data...</p>
                ) : (
                    <div className="space-y-3">
                      <p className="text-lg">Current Streak: <strong>{studyStreak}</strong> day{studyStreak === 1 ? "" : "s"}</p>
                      <p>
                        Last Study Date:{" "}
                        {lastStudyDate ? lastStudyDate.toDate().toLocaleDateString() : "None"}
                      </p>
                      {message && (
                          <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-md">
                            {message}
                          </div>
                      )}
                      <button
                          onClick={recordStudyActivity}
                          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Record Study Activity
                      </button>
                    </div>
                )}
              </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DashboardPage;
