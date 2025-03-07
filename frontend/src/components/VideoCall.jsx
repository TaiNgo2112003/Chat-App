import React, { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

const VideoCall = ({ roomUrl, onCallEnd }) => {
    const callFrameRef = useRef(null);

    useEffect(() => {
        if (callFrameRef.current) {
            // Nếu đã có callFrame thì không tạo mới
            return;
        }

        const callFrame = DailyIframe.createFrame({
            iframeStyle: {
                position: 'fixed',
                top: '10%',
                left: '10%',
                width: '80%',
                height: '80%',
                zIndex: 1000,
            },
            url: roomUrl,
        });

        callFrameRef.current = callFrame;

        callFrame.join();

        callFrame.on('left-meeting', () => {
            onCallEnd(); // Gọi khi user rời phòng
            callFrameRef.current = null; // Xóa ref khi rời phòng
        });

        return () => {
            if (callFrameRef.current) {
                callFrameRef.current.destroy();
                callFrameRef.current = null;
            }
        };
    }, [roomUrl, onCallEnd]);

    return null;
};

export default VideoCall;
