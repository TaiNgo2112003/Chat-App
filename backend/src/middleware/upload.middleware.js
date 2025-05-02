import multer from "multer";

// Cấu hình lưu trữ trong bộ nhớ RAM
const storage = multer.memoryStorage();

// Cấu hình upload Multer với giới hạn file
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Giới hạn 100MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/mkv"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File không hợp lệ!"));
    }
  },
});

// Chấp nhận cả ảnh & video
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

export default uploadFields;
