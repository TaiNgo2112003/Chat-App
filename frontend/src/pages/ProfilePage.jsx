// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { Camera, Mail, User } from "lucide-react";
// import React, { useEffect } from 'react'

// const ProfilePage = () => {
//   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
//   const [selectedImg, setSelectedImg] = useState(null);
//   const checkAuth = useAuthStore((state) => state.checkAuth);

//   useEffect(() => {
//     checkAuth()
//   }, []);
//   console.log("log log: ", authUser);
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       const base64Image = reader.result;
//       setSelectedImg(base64Image);
//       await updateProfile({ profilePic: base64Image });
//     };
//   };

//   return (
//     <div className="h-screen pt-20">
//       <div className="max-w-2xl mx-auto p-4 py-8">
//         <div className="bg-base-300 rounded-xl p-6 space-y-8">
//           <div className="text-center">
//             <h1 className="text-2xl font-semibold ">Profile</h1>
//             <p className="mt-2">Your profile information</p>
//           </div>

//           {/* avatar upload section */}

//           <div className="flex flex-col items-center gap-4">
//             <div className="relative">
//               <img
//                 src={selectedImg || authUser.user?.profilePic || "/image.png"}
//                 alt="Profile"
//                 className="size-32 rounded-full object-cover border-4 "
//               />
//               <label
//                 htmlFor="avatar-upload"
//                 className={`
//                   absolute bottom-0 right-0 
//                   bg-base-content hover:scale-105
//                   p-2 rounded-full cursor-pointer 
//                   transition-all duration-200
//                   ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
//                 `}
//               >
//                 <Camera className="w-5 h-5 text-base-200" />
//                 <input
//                   type="file"
//                   id="avatar-upload"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   disabled={isUpdatingProfile}
//                 />
//               </label>
//             </div>
//             <p className="text-sm text-zinc-400">
//               {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
//             </p>
//           </div>

//           <div className="space-y-6">
//             <div className="space-y-1.5">
//               <div className="text-sm text-zinc-400 flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Full Name
//               </div>
//               <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
//                 {authUser.user?.fullName || authUser.fullName || "No data available"}
//               </p>
//             </div>

//             <div className="space-y-1.5">
//               <div className="text-sm text-zinc-400 flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 Email Address
//               </div>
//               <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
//                 {authUser.user?.email || authUser.email || 'No data available'}
//               </p>
//             </div>
//           </div>

//           <div className="mt-6 bg-base-300 rounded-xl p-6">
//             <h2 className="text-lg font-medium  mb-4">Account Information</h2>
//             <div className="space-y-3 text-sm">
//               <div className="flex items-center justify-between py-2 border-b border-zinc-700">
//                 <span>Member Since</span>
//                 <span>
//                   {authUser.createdAt?.split("T")[0] || authUser.user.createdAt?.split("T")[0] || "No data available"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between py-2">
//                 <span>Account Status</span>
//                 {(() => {
//                   const updatedAt = new Date(authUser.updatedAt?.split("T")[0] || authUser.user.updatedAt?.split("T")[0]);
//                  console.log("Date console: ", updatedAt);
//                   const now = new Date(); // Lấy thời gian hiện tại
//                   const diffInDays = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24)); // Tính số ngày chênh lệch

//                   return diffInDays > 50 ? (
//                     <span className="text-green-500">Active</span>

//                   ) : (
//                     <span className="text-green-500">Active</span>
//                   );
//                 })()}
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProfilePage;


import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { Camera, Mail, User } from "lucide-react";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, checkAuth } = useAuthStore();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Khi load page: nếu có userId thì gọi API public, nếu không thì dùng authUser
  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          setLoading(true);
          const res = await axios.get(`${BASE_URL}/api/auth/profile?id=${userId}`);
          setProfile(res.data);
        } catch (error) {
          console.error("Error fetching public profile:", error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      } else {
        // Nếu không có id → dùng authUser từ store
        setProfile(authUser?.user || authUser);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
      // Cập nhật state để hiển thị ảnh mới ngay lập tức
      setProfile((prev) => ({ ...prev, profilePic: base64Image }));
    };
  };

  if (loading) return <p className="text-center mt-10">⏳ Đang tải...</p>;
  if (!profile) return <p className="text-center mt-10 text-red-500">❌ Không tìm thấy user</p>;

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={profile.profilePic || "/image.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              {/* Chỉ cho phép upload nếu đang xem profile của chính mình */}
              {!userId && (
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              )}
            </div>
            {!userId && (
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            )}
          </div>

          {/* Thông tin */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{profile.fullName || "No data"}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{profile.email || "No data"}</p>
            </div>
          </div>

          {/* Thêm phần thông tin khác */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{profile.createdAt?.split("T")[0] || "No data"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
