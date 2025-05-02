import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../lib/cloudinary.js";
import uploadFile from "../lib/filebase.js"; // Nếu bạn muốn lưu file ở nơi khác, có thể bỏ dòng này
import streamifier from "streamifier";

// Lấy danh sách bài viết
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("userId", "fullName profilePic")
            .populate({
                path: "comments", // Populate comments   
                populate: { path: "userId", select: "fullName profilePic" } // Lấy thông tin người bình luận
            })
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getPosts:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Đăng bài
const uploadVideoToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "video" },
            (error, result) => {
                if (error) {
                    console.error("❌ Lỗi upload video:", error);
                    reject(error);
                } else {
                    console.log("✅ Video đã upload:", result.secure_url);
                    resolve(result.secure_url);
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

export const createPost = async (req, res) => {
    try {
        console.log("📩 Body:", req.body);
        console.log("📂 Files:", req.files);

        const { title, content } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ error: "Bạn cần đăng nhập để đăng bài." });
        }

        let mediaURL = null;

        // 🛑 Xử lý ảnh nếu có (image đang ở dạng base64)
        if (req.body.image) {
            console.log("🛠️ Ảnh nhận từ FE:", req.body.image);
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                resource_type: "auto",
            });
            mediaURL = uploadResponse.secure_url;
        }

        // 🛑 Xử lý video nếu có
        if (req.files?.video) {
            console.log("🎥 Video nhận từ FE:", req.files.video);
            mediaURL = await uploadVideoToCloudinary(req.files.video[0].buffer);
        }

        // 🛑 Lưu bài post mới
        const newPost = new Post({ userId, title, content, media: mediaURL });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error("❌ Error in createPost:", error.message);
        res.status(500).json({ error: "Lỗi server!" });
    }
};


// Bình luận vào bài viết
export const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { postId } = req.params;
        const userId = req.user._id;

        const newComment = new Comment({ postId, userId, content });
        await newComment.save();

        // ✅ Thêm comment vào bài post
        await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error in createComment:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const reactToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { reactionType } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            console.error("reactToPost Error: User not authenticated");
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Tìm bài viết
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post không tồn tại." });
        }

        // Đảm bảo `reactions` là một mảng
        if (!Array.isArray(post.reactions)) {
            post.reactions = [];
        }

        // Xóa reaction cũ của user nếu có
        post.reactions = post.reactions.filter(r => r?.userId?.toString() !== userId.toString());

        // Thêm reaction mới
        post.reactions.push({ userId, type: reactionType });

        // Lưu thay đổi
        await post.save();

        res.status(200).json({ success: true, reactions: post.reactions });
    } catch (error) {
        console.error("Error in reactToPost:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



