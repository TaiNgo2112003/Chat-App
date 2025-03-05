import { useEffect, useRef } from "react";
import useRTCStore from "../stores/rtcStore";

const VideoCallScreen = () => {
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const { localStream, remoteStream, initLocalStream } = useRTCStore();

    useEffect(() => {
        // ✅ Nếu chưa có localStream, yêu cầu quyền truy cập
        if (!localStream) {
            initLocalStream().then((stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            });
        } else {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
            }
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="grid grid-cols-2 gap-4">
                <video ref={localVideoRef} autoPlay muted className="w-full h-full border" />
                <video ref={remoteVideoRef} autoPlay className="w-full h-full border" />
            </div>
        </div>
    );
};

export default VideoCallScreen;
