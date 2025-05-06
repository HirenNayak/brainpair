import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ImageUploadPage from './pages/ImageUploadPage'; 
import Pomodoro from './pages/PomodoroTimerApp';
import UserProfileSettings from "./pages/UserProfileSettings";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/setup" element={<ProfileSetupPage />} />
        <Route path="/upload" element={<ImageUploadPage />} /> 
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/settings" element={<UserProfileSettings />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
