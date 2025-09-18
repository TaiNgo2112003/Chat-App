import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Components
import Navabar from './components/Navabar';

// Pages
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import ToDoPage from "./pages/ToDoPage";
import CloudPage from "./pages/CloudPage";
import ContactsPage from "./pages/ContactsPage";
import DiscoveryPage from "./pages/DiscoveryPage";
import TimeLinePage from "./pages/TimeLinePage";
import AiImage from "./pages/AIImage";
// Stores
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

// Notifications
import { Toaster } from "react-hot-toast";



const App = () => {
  const { theme } = useThemeStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { authUser } = useAuthStore();


  // ✅ Check authentication when app loads
  useEffect(() => {
    checkAuth();
  }, []);


  return (
    <div data-theme={theme}>
      {/* Điều hướng & Navbar */}
      <Navabar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={!authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/todo" element={authUser ? <ToDoPage /> : <Navigate to="/login" />} />
        <Route path="/generatorimage" element={authUser ? <AiImage /> : <Navigate to="/login" />} />
        <Route path="/cloud" element={authUser ? <CloudPage /> : <Navigate to="/login" />} />
        <Route path="/contacts" element={authUser ? <ContactsPage /> : <Navigate to="/login" />} />
        <Route path="/discovery" element={authUser ? <DiscoveryPage /> : <Navigate to="/login" />} />
        <Route path="/timeline" element={authUser ? <TimeLinePage /> : <Navigate to="/login" />} />
      </Routes>

      {/* Modal nhận cuộc gọi */}


      <Toaster />
    </div>
  );
};

export default App;
