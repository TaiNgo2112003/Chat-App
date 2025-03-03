import React, { useEffect } from 'react'
import Navabar from './components/Navabar'
import { Routes, Route, Navigate } from 'react-router-dom'

import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingPage from "./pages/SettingPage"
import ProfilePage from "./pages/ProfilePage"
import ToDoPage from "./pages/ToDoPage"
import CloudPage from "./pages/CloudPage"
import ContactsPage from "./pages/ContactsPage"
import DiscoveryPage from "./pages/DiscoveryPage"
import TimeLinePage from "./pages/TimeLinePage"
import AiImage from "./pages/AIImage"
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast";

const App = () => {
  const { theme } = useThemeStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const onlineUsers = useAuthStore();
  const { authUser } = useAuthStore();

  //console.log("onlineUsers on App.jsx:", onlineUsers)
  useEffect(() => {
    checkAuth()
  }, []);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );

  //console.log({ authUser });
  //console.log();
  return (
    <div data-theme={theme}>
      <Navabar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />

        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

        <Route path='/settings' element={<SettingPage />} />

        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        <Route path='/todo' element={authUser ? <ToDoPage /> : <Navigate to="/login" />} />

        <Route path='/generatorimage' element={authUser ? <AiImage /> : <Navigate to="/login" />} />

        <Route path='/cloud' element={authUser ? <CloudPage /> : <Navigate to="/login" />} />

        <Route path='/contacts' element={authUser ? <ContactsPage /> : <Navigate to="/login" />} />

        <Route path='/discovery' element={authUser ? <DiscoveryPage /> : <Navigate to="/login" />} />

        <Route path='/timeline' element={authUser ? <TimeLinePage /> : <Navigate to="/login" />} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App
