import React, { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

const VideoCall = ({ roomUrl, onCallEnd }) => {
  const callFrameRef = useRef(null);

  useEffect(() => {
    callFrameRef.current = DailyIframe.createFrame({
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

    callFrameRef.current.join();

    // Cleanup khi đóng
    return () => callFrameRef.current.destroy();
  }, [roomUrl]);

  return null;
};

export default VideoCall;
