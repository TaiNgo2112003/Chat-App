// dailyManager.js - Quản lý Singleton Daily CallFrame

import DailyIframe from '@daily-co/daily-js';

let callFrame = null;

/**
 * Tạo hoặc lấy CallFrame đã tồn tại.
 */
export const getOrCreateCallFrame = (url) => {
    if (!callFrame) {
        callFrame = DailyIframe.createFrame({
            iframeStyle: {
                position: 'fixed',
                top: '10%',
                left: '10%',
                width: '80%',
                height: '80%',
                zIndex: 1000,
            },
            url: url,
        });
    } else {
        // Nếu đã tồn tại frame thì update URL nếu khác
        if (callFrame.properties?.url !== url) {
            callFrame.setProperties({ url });
        }
    }
    return callFrame;
};

/**
 * Hủy CallFrame hiện tại.
 */
export const destroyCallFrame = () => {
    if (callFrame) {
        callFrame.destroy();
        callFrame = null;
    }
};

/**
 * Kiểm tra xem có CallFrame nào đang tồn tại không.
 */
export const hasExistingCallFrame = () => {
    return !!callFrame;
};
