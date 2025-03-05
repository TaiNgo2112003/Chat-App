import { create } from 'zustand';

const useRTCStore = create((set) => ({
    localStream: null,
    remoteStream: null,

    setLocalStream: (stream) => set({ localStream: stream }),
    setRemoteStream: (stream) => set({ remoteStream: stream }),

    initLocalStream: async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            set({ localStream: stream });
            return stream;
        } catch (err) {
            console.error("Không thể truy cập camera/microphone:", err);
            throw err;
        }
    },
}));

export default useRTCStore;
