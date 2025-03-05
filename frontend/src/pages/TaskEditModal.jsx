import React, { useState, useEffect } from "react";

const TaskEditModal = ({ isOpen, onClose, task, onSave }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        status: "pending",
    });

    // Khi task thay đổi (ấn sửa task khác), set lại form
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
                priority: task.priority || "Low",
                status: task.status || "pending",
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSave(task._id, formData); // Gọi hàm update ở ngoài
        onClose(); // Đóng modal sau khi save
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Chỉnh sửa Task</h2>

                <div className="space-y-3">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Tiêu đề"
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Mô tả"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskEditModal;
