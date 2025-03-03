import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
        status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" }

    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
