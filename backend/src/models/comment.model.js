import mongoose  from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // ID bài viết được bình luận
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID người bình luận
    content: { type: String, required: true }, // Nội dung bình luận
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    updatedAt: { type: Date, default: Date.now } // Ngày cập nhật
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;