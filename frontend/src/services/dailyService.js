import { axiosInstance } from "../lib/axios"; 

export const createDailyRoom = async (roomName) => {
    try {
        const response = await axiosInstance.post('/call/create-room', {
            roomName,
        });

        if (response.data.success) {
            return response.data.room;
        } else {
            throw new Error(response.data.message || 'Tạo phòng video thất bại');
        }
    } catch (error) {
        console.error('Lỗi khi tạo phòng Daily:', error);
        throw error;
    }
};
