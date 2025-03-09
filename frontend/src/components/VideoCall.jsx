import React, { useEffect } from 'react';
import { getOrCreateCallFrame, destroyCallFrame } from "../services/dailyManager";

const VideoCall = ({ roomUrl, onCallEnd }) => {

    useEffect(() => {
        const callFrame = getOrCreateCallFrame(roomUrl);

        callFrame.join();

        callFrame.on('left-meeting', () => {
            onCallEnd();
            destroyCallFrame();
        });

        return () => {
            destroyCallFrame();
        };
    }, [roomUrl, onCallEnd]);

    return null;
};

export default VideoCall;
