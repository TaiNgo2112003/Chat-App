import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { PhoneIcon, VideoCameraIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from 'react';
import VideoCall from './VideoCall';  // Thêm dòng này
import { useState } from 'react';

const ChatHeader = () => {

  const { selectedUser, setSelectedUser } = useChatStore();
  const { socket, authUser, onlineUsers } = useAuthStore();
  const [roomUrl, setRoomUrl] = useState('');

  const initiateVideoCall = (receiverId) => {
    const roomId = `${authUser._id}-${receiverId}`;  // Tạo roomId đơn giản
    const url = `https://chatroomtai.daily.co/8dGLXCGUvG96jyYl7xMf`;
    setRoomUrl(url);
  };
  const openFindInChat = () => {
    toast('🔍 Tính năng tìm kiếm chưa được hỗ trợ.');
  };
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Call Button */}
          <button
            onClick={() => initiateVideoCall(selectedUser._id)}
            className="btn btn-sm btn-secondary"
          >
            Video
          </button>

          {/* Video Call Button */}
          <button
            onClick={() => initiateVideoCall(selectedUser._id)}
            className="btn btn-sm btn-secondary flex items-center gap-1"
            title="Video Call"
          >
            <VideoCameraIcon className="w-5 h-5" />
            Video
          </button>

          {/* Find in Chat Button */}
          <button
            onClick={openFindInChat}
            className="btn btn-sm btn-accent flex items-center gap-1"
            title="Find in Chat"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            Find
          </button>

          {/* Close Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-sm btn-ghost flex items-center gap-1"
            title="Close"
          >
            <XMarkIcon className="w-5 h-5" />
            Close
          </button>
          {roomUrl && <VideoCall roomUrl={roomUrl} onCallEnd={() => setRoomUrl('')} />}

        </div>
      </div>
    </div>
  );
};

export default ChatHeader;





// const {
//   initLocalStream,
//   createPeerConnection,
//   addLocalTracks,
//   peerConnection,
//   setRemoteStream
// } = useRTCStore();
//   // Placeholder cho tìm kiếm trong chat (bạn cần implement sau)
//   const openFindInChat = () => {
//     toast('🔍 Tính năng tìm kiếm chưa được hỗ trợ.');
//   };
// const startCall = async (receiverId) => {
//   if (!authUser || !selectedUser) {
//     toast.error("Vui lòng chọn người dùng trước khi gọi.");
//     return;
//   }

//   try {
//     const stream = await initLocalStream();
//     console.log("Local stream ready", stream);

//     const pc = createPeerConnection();

//     addLocalTracks();

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("iceCandidate", {
//           candidate: event.candidate,
//           to: receiverId,
//         });
//       }
//     };

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     socket.emit("callUser", {
//       callerId: authUser._id,
//       receiverId: receiverId,
//       callerName: authUser.fullName,
//       offer,
//     });

//     toast.success(`📞 Đang gọi tới ${selectedUser.fullName}...`);
//   } catch (err) {
//     console.error("Lỗi khi khởi tạo cuộc gọi:", err);
//     toast.error("Không thể bắt đầu cuộc gọi.");
//   }
// };

// useEffect(() => {
//   if (!socket) return;

//   // Khi nhận offer từ caller
//   socket.on("incomingCall", async ({ callerId, callerName, offer }) => {
//     const accept = window.confirm(`${callerName} đang gọi. Bạn có muốn nhận không?`);

//     if (!accept) {
//       socket.emit("callRefused", { to: callerId });
//       return;
//     }

//     toast.success(`📞 Đang kết nối với ${callerName}...`);

//     const stream = await initLocalStream();
//     const pc = createPeerConnection();
//     addLocalTracks();

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("iceCandidate", {
//           candidate: event.candidate,
//           to: callerId,
//         });
//       }
//     };

//     pc.ontrack = (event) => {
//       const remoteStream = new MediaStream();
//       event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
//       setRemoteStream(remoteStream);
//     };

//     await pc.setRemoteDescription(new RTCSessionDescription(offer));

//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);

//     socket.emit("answerCall", { answer, to: callerId });
//   });

//   // Khi nhận answer từ callee
//   socket.on("callAnswered", async ({ answer }) => {
//     await peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
//     toast.success(`${selectedUser?.fullName} đã nhận cuộc gọi!`);
//   });

//   // Xử lý ICE Candidate
//   socket.on("iceCandidate", async ({ candidate }) => {
//     if (candidate) {
//       try {
//         await peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (err) {
//         console.error("Lỗi khi thêm ICE candidate:", err);
//       }
//     }
//   });

//   return () => {
//     socket.off("incomingCall");
//     socket.off("callAnswered");
//     socket.off("iceCandidate");
//   };
// }, [socket, peerConnection, selectedUser]);