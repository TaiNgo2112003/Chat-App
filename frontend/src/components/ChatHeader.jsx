import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { PhoneIcon, VideoCameraIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from 'react';
import VideoCall from './VideoCall';  // Thêm dòng này
import { useState } from 'react';
import { createDailyRoom } from '../services/dailyService';
import { useCallStore } from "../store/useCallStore";
const ChatHeader = () => {

  const { selectedUser, setSelectedUser } = useChatStore();
  const { socket, authUser, onlineUsers } = useAuthStore();
  const [roomUrl, setRoomUrl] = useState('');
  const [isCalling, setIsCalling] = useState(false);  // kiểm soát hiển thị VideoCall

  const {
    notification,
    users,
    selectedUserCall,
    isUsersLoading,
    subscribeToCall,
    unsubscribeFromCall,
    setSelectedUserCall,
  } = useCallStore();
  const {sendNotification} = useCallStore();
  console.log("selectedUser",selectedUser._id) 
  const roomId = [authUser.user._id, selectedUser._id].sort().join('');

  useEffect(() => {
    subscribeToCall(); 
    return () => unsubscribeFromCall();
  }, []);
  
  // Fetch messages and set up subscription
  useEffect(() => {
    if (selectedUserCall && selectedUser._id) {
      subscribeToCall();
    }
    return () => unsubscribeFromCall();
  }, [selectedUserCall, subscribeToCall, unsubscribeFromCall]);

  const handleVideoCall = async () => {
    const receiverId = selectedUser._id;
  
    try {
      // 🚀 Cập nhật selectedUserCall trước khi gọi API
      setSelectedUserCall(selectedUser);  
  
      const room = await createDailyRoom(roomId);
      setRoomUrl(room.url);
      setIsCalling(true);
  
      const notificationData = {
        idRoom: room.url,
      };
  
      console.log("📩 Gửi notification:", notificationData);
      await sendNotification(notificationData); // 🔥 Giờ `selectedUserCall` không bị undefined nữa
  
      if (socket) {
        console.log("🔵 Gửi sự kiện callVideoRequest đến:", receiverId);
        socket.emit('callVideoRequest', {
          senderId: authUser.user._id,
          receiverId,
          idRoom: room.url,
        });
      }
    } catch (error) {
      console.error('Lỗi khi tạo phòng hoặc gửi thông báo:', error);
      alert('Không thể tạo phòng hoặc gửi thông báo.');
    }
  };
  
  
  


  const handleEndCall = () => {
    setIsCalling(false);
    setRoomUrl('');
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
          <button onClick={handleVideoCall}>Gọi Video</button>

          {isCalling && roomUrl && (
            <VideoCall roomUrl={roomUrl} onCallEnd={handleEndCall} />
          )}

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
          {/* {roomUrl && <VideoCall roomUrl={roomUrl} onCallEnd={() => setRoomUrl('')} />} */}
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