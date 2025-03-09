import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

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

const socket = io("http://localhost:5001"); // ⚡ Kết nối socket với backend

const App = () => {
  const { theme } = useThemeStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { authUser } = useAuthStore();
  const [callData, setCallData] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  // Lắng nghe sự kiện nhận cuộc gọi từ socket.io
  useEffect(() => {
    if (!authUser) return;

    socket.on("callVideoRequest", (data) => {
      console.log("📞 Nhận cuộc gọi:", data); // ✅ Debug: Kiểm tra dữ liệu nhận được
      setCallData(data);
    });

    return () => {
      socket.off("callVideoRequest"); // Hủy lắng nghe khi component unmount
    };
  }, [authUser]);

  const handleAcceptCall = () => {
    if (callData) {
      console.log("✅ Chấp nhận cuộc gọi, mở phòng:", callData.idRoom);
      window.open(callData.idRoom, "_blank");
      setCallData(null); // Đóng popup
    }
  };

  const handleRejectCall = () => {
    console.log("❌ Từ chối cuộc gọi");
    setCallData(null); // Đóng popup
  };

  return (
    <div data-theme={theme}>
      {/* Navbar */}
      <Navabar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/todo" element={authUser ? <ToDoPage /> : <Navigate to="/login" />} />
        <Route path="/generatorimage" element={authUser ? <AiImage /> : <Navigate to="/login" />} />
        <Route path="/cloud" element={authUser ? <CloudPage /> : <Navigate to="/login" />} />
        <Route path="/contacts" element={authUser ? <ContactsPage /> : <Navigate to="/login" />} />
        <Route path="/discovery" element={authUser ? <DiscoveryPage /> : <Navigate to="/login" />} />
        <Route path="/timeline" element={authUser ? <TimeLinePage /> : <Navigate to="/login" />} />
      </Routes>

      {/* Modal hiển thị khi có cuộc gọi */}
      {callData && (
        <div className="modal">
          <h3>📞 Có cuộc gọi đến!</h3>
          <p>Từ người dùng: {callData.senderId}</p>
          <button onClick={handleAcceptCall}>✅ Chấp nhận</button>
          <button onClick={handleRejectCall}>❌ Từ chối</button>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default App;
