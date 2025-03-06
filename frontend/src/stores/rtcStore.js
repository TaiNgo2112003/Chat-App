import { create } from "zustand";

const useRTCStore = create((set, get) => ({
    localStream: null,
    remoteStream: null,
    peerConnection: null,

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

    createPeerConnection: () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // Khi nhận được track từ peer, cập nhật remoteStream
        pc.ontrack = (event) => {
            const remoteStream = new MediaStream();
            event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
            set({ remoteStream });
        };

        set({ peerConnection: pc });

        return pc;
    },

    addLocalTracks: () => {
        const { peerConnection, localStream } = get();
        if (peerConnection && localStream) {
            localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
        }
    }
}));

export default useRTCStore;
