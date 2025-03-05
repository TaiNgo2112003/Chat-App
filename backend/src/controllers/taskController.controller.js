import Task from "../models/task.model.js";

// Lấy tất cả tasks của user hiện tại
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
        console.log("Tasks in backend:", tasks); // Debug xem có dữ liệu không
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error in getTasks controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Tạo task mới
export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;

        const newTask = new Task({
            userId: req.user._id,
            title,
            description,
            dueDate,
            priority,
            status,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error in createTask controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Xóa task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id deletetask: ", id)
        const task = await Task.findById(id);
        console.log("task deletetask: ", task)

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (task.userId.toString() !== req.user._id.toString()) {

            return res.status(403).json({ error: "Not authorized to delete this task" });
        }

        await task.deleteOne();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error in deleteTask controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Cập nhật task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority, status } = req.body;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized to update this task" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;

        const updatedTask = await task.save();

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error in updateTask controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



