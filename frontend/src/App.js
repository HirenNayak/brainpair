import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;
