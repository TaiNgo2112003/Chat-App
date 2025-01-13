import multer from "multer";

// Cấu hình Multer
const storage = multer.memoryStorage(); // Sử dụng memoryStorage để lưu file trong bộ nhớ RAM
const upload = multer({ storage: storage }); // Định nghĩa middleware multer
export default upload;
