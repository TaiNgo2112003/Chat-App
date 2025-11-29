import mongoose from "mongoose";

const SocialMediaSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const CloudStorageSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  capacity: { type: Number, default: 0 }, // MB hoặc GB tùy bạn
  purchasedAt: { type: Date, default: null },
  expiresAt: { type: Date, default: null },
  transactionId: { type: String, default: "" }, // mã giao dịch ZaloPay
    packageId: { type: String, default: "" }, // <--- thêm vào đây

}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      default: "",
      minlength: 6,
    },

    profilePic: {
      type: String,
      default: "",
    },

    socialMedias: {
      type: [SocialMediaSchema],
      default: [],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // ⚡ FIELD MỚI: CLOUD STORAGE
    cloudStorage: {
      type: CloudStorageSchema,
      default: () => ({
        isActive: false,
        capacity: 0,
        purchasedAt: null,
        expiresAt: null,
        transactionId: "",
        packageId: "",
      }),
    },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;
