import mongoose  from "mongoose";

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID người đăng bài
    title: { type: String, required: true }, // Tiêu đề bài viết
    content: { type: String, required: false }, // Nội dung bài viết (có thể là text, URL ảnh/video)
    media: { type: String, required: false }, // URL ảnh hoặc video

    reactions: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID người thả reaction
          type: { type: String, enum: ["like", "heart", "smile", "sad", "angry"] } // Loại reaction
        }
      ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // ✅ Thêm mảng comments
    shares: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    updatedAt: { type: Date, default: Date.now } // Ngày cập nhật
});

const Post = mongoose.model('Post', postSchema);
export default Post;
