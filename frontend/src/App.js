import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ImageUploadPage from './pages/ImageUploadPage';
import DashboardPage from "./pages/DashboardPage";
import MatchesPage from "./pages/MatchesPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import ChatPage from './pages/ChatPage';
import Pomodoro from './pages/PomodoroTimerApp';
import UserProfileSettings from "./pages/UserProfileSettings";
import MessageListener from "./components/MessageListener";
import GroupsPage from "./pages/GroupsPage";
import GroupChatPage from "./pages/GroupChatPage";

function App() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <Router>
        <MessageListener />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/setup" element={<ProfileSetupPage />} />
          <Route path="/upload" element={<ImageUploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/chat/:userId" element={<ChatPage />} />
          <Route path="/settings" element={<UserProfileSettings />} />

          
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/group-chat/:groupId" element={<GroupChatPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
