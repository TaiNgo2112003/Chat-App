import React, { useState, useEffect, useRef } from "react";
import { FaRegComment, FaVideo, FaThumbsUp, FaShare, FaTimes, FaEllipsisH, FaRegEye, FaBookmark, FaExclamationTriangle, FaHeart, FaSmile, FaSadTear, FaAngry } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { AiFillHeart, AiFillSmile, AiFillFrown, AiFillMeh } from "react-icons/ai";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import toast from "react-hot-toast";

const TimeLinePage = () => {
  const [newPost, setNewPost] = useState({ title: "", image: null, video: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [reactionPopup, setReactionPopup] = useState(null);
  const [openCommentPost, setOpenCommentPost] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);

  const { authUser } = useAuthStore();
  const { posts, getPosts, createPost, commentOnPost, reactToPost } = usePostStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    getPosts();
  }, []);
  useEffect(() => {
    const reactionsMap = {};
    posts.forEach((post) => {
      const userReaction = post.reactions?.find((r) => r.userId === authUser?.user?._id)?.type;
      if (userReaction) {
        reactionsMap[post._id] = userReaction;
      }
    });
    setSelectedReaction(reactionsMap);
  }, [posts, authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn một ảnh hợp lệ.");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setVideoPreview(null);
    setNewPost({ ...newPost, image: file, video: null });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("video/")) {
      toast.error("Vui lòng chọn một video hợp lệ.");
      return;
    }

    setVideoPreview(URL.createObjectURL(file));
    setImagePreview(null);
    setNewPost({ ...newPost, video: file, image: null });
  };

  const removeImage = () => {
    setImagePreview(null);
    setNewPost({ ...newPost, image: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setNewPost({ ...newPost, video: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePostSubmit = async () => {
    if (!newPost.title.trim() && !newPost.image && !newPost.video) {
      toast.error("Bài viết không thể trống.");
      return;
    }

    let imageBase64 = null;
    let videoFile = null;

    const imagePromise = new Promise((resolve) => {
      if (newPost.image) {
        const reader = new FileReader();
        reader.readAsDataURL(newPost.image);
        reader.onload = () => {
          imageBase64 = reader.result;
          resolve();
        };
      } else {
        resolve();
      }
    });

    const videoPromise = new Promise((resolve) => {
      if (newPost.video) {
        videoFile = newPost.video;
        resolve();
      } else {
        resolve();
      }
    });

    await Promise.all([imagePromise, videoPromise]);
    await submitPost(imageBase64, videoFile);
  };

  const submitPost = async (imageBase64, videoFile) => {
    const formData = new FormData();
    formData.append("userId", authUser?.user?._id);
    formData.append("title", newPost.title);
    formData.append("content", "");

    if (imageBase64) formData.append("image", imageBase64);
    if (videoFile) formData.append("video", videoFile);

    await createPost(formData);
    setNewPost({ title: "", image: null, video: null });
    setImagePreview(null);
    setVideoPreview(null);
  };

  const handleCommentSubmit = async (postId, commentText) => {
    if (!commentText.trim()) return;

    await commentOnPost(postId, { content: commentText });
    setCommentTexts({ ...commentTexts, [postId]: "" });
  };
  const handleReact = async (postId, reactionType) => {
    await reactToPost(postId, reactionType);

    // Update the selected reaction state for the specific post
    setSelectedReaction((prev) => ({
      ...prev,
      [postId]: reactionType, // Update the reaction for this post
    }));
  };
  const REACTION_ICONS = {
    like: <FaThumbsUp className="w-5 h-5" />,
    heart: <FaHeart className="w-5 h-5" />,
    smile: <FaSmile className="w-5 h-5" />,
    sad: <FaSadTear className="w-5 h-5" />,
    angry: <FaAngry className="w-5 h-5" />,
  };

  return (
    <div className="max-w-2xl mx-auto mt-5">
      <br /> <br /> <br />
      {/* Form đăng bài */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={authUser?.user?.profilePic || "/image.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            placeholder="Bạn đang nghĩ gì?"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="flex-1 p-2 border rounded-lg outline-none"
          />
        </div>

        {imagePreview && (
          <div className="relative mt-2 flex justify-center">
            <img src={imagePreview} alt="Preview" className="max-w-[150px] h-auto rounded-lg shadow-md" />
            <button
              className="absolute top-0 right-0 bg-gray-800 text-white p-1 rounded-full"
              onClick={removeImage}
            >
              <FaTimes />
            </button>
          </div>
        )}

        {videoPreview && (
          <div className="relative mt-2">
            <video controls className="w-full rounded-lg">
              <source src={videoPreview} type="video/mp4" />
            </video>
            <button
              className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full"
              onClick={removeVideo}
            >
              <FaTimes />
            </button>
          </div>
        )}

        <div className="flex justify-between mt-2">
          <label className="flex items-center space-x-1 text-blue-500 cursor-pointer">
            <AiOutlinePicture className="w-5 h-5" />
            <span>Ảnh</span>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </label>

          <label className="flex items-center space-x-1 text-red-500 cursor-pointer">
            <FaVideo className="w-5 h-5" />
            <span>Video</span>
            <input
              type="file"
              accept="video/*"
              hidden
              ref={fileInputRef}
              onChange={handleVideoChange}
            />
          </label>

          <button
            onClick={handlePostSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Đăng
          </button>
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div className="space-y-6">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                {/* Left Side: Avatar, Name, Follow, and Timestamp */}
                <div className="flex items-center space-x-4">
                  <img
                    src={post.userId?.profilePic || "/image.png"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">{post.userId?.fullName}</p>
                      <span className="text-blue-500 text-sm cursor-pointer">Theo dõi</span>
                    </div>
                    <p className="text-sm mt-1 mb-2 text-gray-500">
                      {new Date(post.createdAt).toLocaleString("vi-VN", {
                        hour: "numeric",
                        minute: "numeric",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Right Side: Three Dots and X Button */}
                <div className="flex items-center space-x-2">
                  {/* Three Dots Button */}
                  <div className="relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      <FaEllipsisH className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white shadow-md rounded-lg border z-10">
                        {/* Quan tâm */}
                        <button className="w-full text-left flex items-center p-3 hover:bg-gray-100">
                          <FaRegEye className="text-blue-500 w-5 h-5 mr-2" />
                          <div>
                            <p className="font-semibold">Quan tâm</p>
                            <p className="text-sm text-gray-500">
                              Bạn sẽ thấy nhiều bài viết tương tự hơn.
                            </p>
                          </div>
                        </button>

                        {/* Lưu bài viết */}
                        <button className="w-full text-left flex items-center p-3 hover:bg-gray-100">
                          <FaBookmark className="text-green-500 w-5 h-5 mr-2" />
                          <div>
                            <p className="font-semibold">Lưu bài viết</p>
                            <p className="text-sm text-gray-500">
                              Lưu bài viết này vào danh sách của bạn.
                            </p>
                          </div>
                        </button>

                        {/* Chia sẻ */}
                        <button className="w-full text-left flex items-center p-3 hover:bg-gray-100">
                          <FaShare className="text-purple-500 w-5 h-5 mr-2" />
                          <div>
                            <p className="font-semibold">Chia sẻ</p>
                            <p className="text-sm text-gray-500">
                              Chia sẻ bài viết này với bạn bè.
                            </p>
                          </div>
                        </button>

                        {/* Báo cáo */}
                        <button className="w-full text-left flex items-center p-3 hover:bg-gray-100">
                          <FaExclamationTriangle className="text-red-500 w-5 h-5 mr-2" />
                          <div>
                            <p className="font-semibold">Báo cáo</p>
                            <p className="text-sm text-gray-500">
                              Báo cáo bài viết này nếu có vấn đề.
                            </p>
                          </div>
                        </button>

                        {/* Ẩn bài viết */}
                        <button
                          className="w-full text-left flex items-center p-3 hover:bg-gray-100"
                          onClick={() => {
                            onHidePost(post._id);
                            setMenuOpen(false);
                          }}
                        >
                          <FaTimes className="text-gray-600 w-5 h-5 mr-2" />
                          <div>
                            <p className="font-semibold">Ẩn bài viết</p>
                            <p className="text-sm text-gray-500">
                              Ẩn bài viết này khỏi bảng tin của bạn.
                            </p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* X Button */}
                  <button
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    onClick={() => onHidePost(post._id)}
                  >
                    <FaTimes className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <p className="text-gray-800">{post.title}</p>
              {post.media && (
                post.media.includes("youtube.com") || post.media.includes("youtu.be") ? (
                  // Nếu là URL YouTube
                  <iframe
                    width="100%"
                    height="315"
                    src={
                      post.media.includes("youtu.be")
                        ? `https://www.youtube.com/embed/${post.media.split("/").pop()}`
                        : `https://www.youtube.com/embed/${new URL(post.media).searchParams.get("v")}`
                    }
                    title="YouTube video"
                    className="rounded-lg mt-3"
                    allowFullScreen
                  ></iframe>
                ) : (
                  // Giữ nguyên code của bạn
                  post.media.includes("image") ? (
                    <img
                      src={post.media}
                      alt="Post"
                      className="w-full max-h-80 rounded-lg mt-3 object-contain transition-transform hover:scale-105"
                    />
                  ) : (
                    <video controls className="w-full max-h-80 rounded-lg mt-3">
                      <source src={post.media} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  )
                )
              )}



              <hr className="my-3 border-gray-300" />

              <div className="flex justify-between text-gray-600 text-sm">
                <span>{post.reactions?.length || 0} reactions</span>
                <span>{post.comments?.length || 0} comments</span>
                <span>{post.shares || 0} shares</span>
              </div>

              <hr className="my-3 border-gray-300" />

              <div className="flex justify-around text-gray-600">
                {/*  Button  Reaction*/}
                <div className="relative group">
                  {/* Main Reaction Button */}
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition">
                    {selectedReaction[post._id] ? REACTION_ICONS[selectedReaction[post._id]] : <FaThumbsUp className="w-5 h-5" />}
                    <span>React</span>
                  </button>

                  {/* Reactions Popover (Hidden by Default, Shown on Hover) */}
                  <div className="absolute bottom-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex space-x-1 bg-white rounded-full shadow-lg p-1 border">
                      <button
                        onClick={() => handleReact(post._id, "like")}
                        className="p-1 hover:scale-125 transition-transform"
                        title="Like"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => handleReact(post._id, "heart")}
                        className="p-1 hover:scale-125 transition-transform"
                        title="Love"
                      >
                        ❤️
                      </button>
                      <button
                        onClick={() => handleReact(post._id, "smile")}
                        className="p-1 hover:scale-125 transition-transform"
                        title="Haha"
                      >
                        😃
                      </button>
                      <button
                        onClick={() => handleReact(post._id, "sad")}
                        className="p-1 hover:scale-125 transition-transform"
                        title="Sad"
                      >
                        😢
                      </button>
                      <button
                        onClick={() => handleReact(post._id, "angry")}
                        className="p-1 hover:scale-125 transition-transform"
                        title="Angry"
                      >
                        😡
                      </button>
                    </div>
                  </div>
                </div>



                {/*  Button  Comment*/}
                <button
                  className="flex items-center space-x-1 hover:text-blue-500"
                  onClick={() => setOpenCommentPost(openCommentPost === post._id ? null : post._id)}
                >
                  <FaRegComment className="w-5 h-5" />
                  <span>Bình luận</span>
                </button>

                {/*  Button  Share*/}
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <FaShare className="w-5 h-5" />
                  <span>Chia sẻ</span>
                </button>
              </div>

              {openCommentPost === post._id && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={commentTexts[post._id] || ""}
                      onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                      placeholder="Viết bình luận..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id, commentTexts[post._id])}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <FaRegComment />
                    </button>
                  </div>

                  {post.comments && post.comments.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="flex items-center space-x-2">
                          <img
                            src={comment.userId?.profilePic || "/image.png"}
                            alt="avatar"
                            className="w-8 h-8 rounded-full border"
                          />
                          <div className="bg-gray-100 p-2 rounded-lg flex-1">
                            <p className="font-semibold">{comment.userId?.fullName}</p>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">Chưa có bình luận nào</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Không có bài viết nào.</p>
        )}
      </div>
    </div>
  );
};

export default TimeLinePage;