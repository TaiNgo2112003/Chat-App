import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // AWS SDK v3
import mime from "mime-types"; // Để xác định ContentType từ tên file
import { fromEnv } from "@aws-sdk/credential-provider-env"; // Để lấy credentials từ biến môi trường

// Tạo client S3 với cấu hình Filebase
const s3 = new S3Client({
    credentials: fromEnv(),
    region: "us-east-1", // Region mặc định hoặc region bạn chọn
    endpoint: process.env.AWS_S3_ENDPOINT, // Endpoint từ Filebase
    forcePathStyle: true, // Đảm bảo path style được bật
});

// Hàm upload file lên Filebase
const uploadFile = async (fileBuffer, fileName) => {
    try {
        console.log("fileBuffer", fileBuffer);
        console.log("fileName", fileName);
        const fileType = mime.lookup(fileName); // Xác định loại file
        const command = new PutObjectCommand({
            Bucket: process.env.FILEBASE_BUCKET_NAME, // Tên bucket từ biến môi trường
            Key: `uploads/${fileName}`, // Lưu trữ trong thư mục uploads
            Body: fileBuffer, // Nội dung file
            ContentType: fileType || "application/octet-stream", // ContentType mặc định nếu không xác định được
            
        });


        // Gửi file lên S3
        const data = await s3.send(command);
        console.log("File uploaded successfully:", data);

        // Trả về URL của file
        const fileUrl = `${process.env.AWS_S3_ENDPOINT}/${process.env.FILEBASE_BUCKET_NAME}/uploads/${fileName}`;
        return { fileUrl };
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
};

export default uploadFile;
