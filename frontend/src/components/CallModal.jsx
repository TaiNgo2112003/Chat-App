import React from "react";
import { useNavigate } from "react-router-dom";

const CallModal = ({ callerName, onAccept, onRefuse }) => {
    const navigate = useNavigate();

    const handleAccept = () => {
        onAccept(); // Gọi hàm xử lý cuộc gọi từ cha
        navigate("/videocall"); // Điều hướng sang màn hình call
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg text-center">
                <p className="text-lg font-bold">{callerName} đang gọi cho bạn...</p>
                <div className="mt-4 flex justify-center gap-4">
                    <button 
                        onClick={handleAccept} 
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Chấp nhận
                    </button>
                    <button 
                        onClick={onRefuse} 
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallModal;
