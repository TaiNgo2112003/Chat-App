import express from "express";
import { 
    createTask, 
    getTasks, 
    updateTask, 
    deleteTask ,
    //
} from "../controllers/taskController.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//Lấy task
router.get("/", protectRoute, getTasks);

// Tạo mới task
router.post("/", protectRoute, createTask);

// Cập nhật task (dựa trên taskId)
router.put("/:id", protectRoute, updateTask);

// Xóa task
router.delete("/:id", protectRoute, deleteTask);




export default router;
