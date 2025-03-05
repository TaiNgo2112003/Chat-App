import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navabar from './components/Navabar';
import CallModal from "./components/CallModal";

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
import VideoCallScreen from './components/VideoCallScreen';
// Stores
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import useRTCStore from './stores/rtcStore';

// Notifications
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

// Icons
import { Loader } from "lucide-react";

const App = () => {
  const { theme } = useThemeStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { authUser } = useAuthStore();

  const [incomingCall, setIncomingCall] = useState(null);

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle socket events (incoming call, etc.)
  useEffect(() => {
    if (!authUser) return;

    const socket = useAuthStore.getState().socket;

    if (socket) {
      const handleIncomingCall = ({ callerId, callerName }) => {
        setIncomingCall({ callerId, callerName });

        console.log("✅ Socket connected:", socket.id);
        toast(`📞 Cuộc gọi đến từ ${callerName || 'Người dùng'} (${callerId})`);
      };

      socket.on("incomingCall", handleIncomingCall);

      return () => {
        socket.off("incomingCall", handleIncomingCall);
      };
    }
  }, [authUser]);

  // Handle accepting call
  const handleAcceptCall = async() => {
    const socket = useAuthStore.getState().socket;

    if (socket && incomingCall) {
        socket.emit("acceptCall", {
            callerId: incomingCall.callerId,
            receiverId: authUser._id,
        });

        toast.success(`✅ Đã chấp nhận cuộc gọi từ ${incomingCall.callerName}`);
        setIncomingCall(null);
        await useRTCStore.getState().initLocalStream();

        // ✅ Điều hướng sang giao diện gọi video
        Navigate("/videocall");
    }
};


  // Handle refusing call
  const handleRefuseCall = () => {
    const socket = useAuthStore.getState().socket;

    if (socket && incomingCall) {
      socket.emit("refuseCall", {
        callerId: incomingCall.callerId,
        receiverId: authUser._id,
      });

      toast(`🚫 Đã từ chối cuộc gọi từ ${incomingCall.callerName}`);
      setIncomingCall(null);
    }
  };

  const startCall = async (receiverId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    useRTCStore.getState().setPeerConnection(peerConnection);
    useRTCStore.getState().setLocalStream(localStream);

    peerConnection.ontrack = (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
      useRTCStore.getState().setRemoteStream(remoteStream);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = useAuthStore.getState().socket;
        socket.emit('iceCandidate', { candidate: event.candidate, receiverId });
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const socket = useAuthStore.getState().socket;
    socket.emit('offer', { offer, receiverId });

    // ✅ Hiển thị màn hình gọi khi bắt đầu cuộc gọi
    Navigate("/videocall");
  };


  const socket = useAuthStore.getState().socket;

  if (socket) {
    socket.on('offer', async ({ offer }) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

      useRTCStore.getState().setPeerConnection(peerConnection);
      useRTCStore.getState().setLocalStream(localStream);

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit('answer', { answer });

      peerConnection.ontrack = (event) => {
        const remoteStream = new MediaStream();
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
        useRTCStore.getState().setRemoteStream(remoteStream);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('iceCandidate', { candidate: event.candidate });
        }
      };
    });

    socket.on('answer', async ({ answer }) => {
      const peerConnection = useRTCStore.getState().peerConnection;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('iceCandidate', ({ candidate }) => {
      const peerConnection = useRTCStore.getState().peerConnection;
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  return (
    <div data-theme={theme}>
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
        <Route path="/videocall" element={<VideoCallScreen />} />

      </Routes>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <CallModal
          callerName={`User ${incomingCall.callerId}`}
          onAccept={handleAcceptCall}
          onRefuse={handleRefuseCall}
        />
      )}

      {/* Toast Notification */}
      <Toaster />
    </div>
  );
};

export default App;
