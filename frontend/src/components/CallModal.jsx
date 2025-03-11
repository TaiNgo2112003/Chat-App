import React from "react";

const VideoCallModal = ({ callData, onClose }) => {
  const handleAccept = () => {
    window.location.href = `/video-call/${callData.callId}`; // Chuyển hướng đến trang video call
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>📞 Cuộc gọi đến từ {callData.callerName}</h3>
        <button onClick={handleAccept} className="accept-btn">Chấp nhận</button>
        <button onClick={onClose} className="decline-btn">Từ chối</button>
      </div>
    </div>
  );
};

export default VideoCallModal;
