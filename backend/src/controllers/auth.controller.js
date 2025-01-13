import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  
      const user = await User.findOne({ email });
  
      if (user) return res.status(400).json({ message: "Email already exists" });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
  
      if (newUser) {
        // generate jwt token here
        generateToken(newUser._id, res);
        await newUser.save();
  
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Kiểm tra đầu vào
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      // Tìm người dùng
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Kiểm tra mật khẩu
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Tạo token
      const token= generateToken(user._id, res);
  
      // Trả về thông tin người dùng (không bao gồm mật khẩu)
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        token,
      });
    } catch (error) {
      console.error("Error in login controller:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true, // Đảm bảo chỉ có server mới thao tác được cookie này
      secure: process.env.NODE_ENV === "production", // Chỉ bật 'secure' trong môi trường production
      sameSite: "strict", // Ngăn chặn cookie bị gửi đi không đúng cách
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async(req, res) =>{
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
      return res.status(400).json({message:"Profile picture is required"});
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {profilePic: uploadResponse.secure_url},
      {new: true}
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({message:"Internal server error"});
  }
};

export const checkAuth = (req, res) => {
  try {
    // Trả về thông tin người dùng đã đăng nhập từ `req.user` (middleware `protectRoute` đã xác thực trước đó)
    res.status(200).json({
      message: "Authorized",
      user: req.user,
    });
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


