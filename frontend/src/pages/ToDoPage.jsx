import React, { useState, useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";
import TaskEditModal from "../pages/TaskEditModal";
import ReactPaginate from 'react-paginate';

const CreateTaskForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("pending");

    const { tasks, fetchTasks, createTask, deleteTask, updateTask } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const tasksPerPage = 3;
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(tasks.length / tasksPerPage);
    const offset = currentPage * tasksPerPage;
    const currentTasks = tasks.slice(offset, offset + tasksPerPage);
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected)
    }
    {/* Edit task */ }
    const handleEdit = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    }

    {/* Update task */ }
    const handleSaveTask = async (taskId, updatedData) => {
        await updateTask(taskId, updatedData);
        fetchTasks();
    };

    {/* Save task */ }
    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTask({ title, description, dueDate, priority, status });
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("Medium");
        setStatus("pending")
        fetchTasks(); // Fetch lại danh sách task sau khi thêm
    };

    {/* Delete task */ }
    const handleDelete = (taskId) => {
        console.log("task id in to do: ", taskId)
        if (window.confirm("Bạn có chắc chắn muốn xóa task này không?")) {
            deleteTask(taskId);
        }
    };
    useEffect(() => {
        fetchTasks(); // Lấy danh sách task khi vào trang
    }, []);

    return (
        <div className="min-h-screen container mx-auto px-4 pt-20 max-w-3xl">
            {/* Form tạo task */}
            <div className="bg-white shadow-lg rounded-lg p-6 space-y-4 border">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">Title</label>
                        <input
                            type="text"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-2 border rounded focus:outline-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 font-medium mb-1">Description</label>
                        <textarea
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-blue-500"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-gray-600 font-medium mb-1">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-600 font-medium mb-1">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-600 font-medium mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-blue-500"
                            >
                                <option value="in-progress">In-progress</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-base-300 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>

            {/* Danh sách Task */}
            <div className="mt-6">
                <ul className="space-y-3">
                    {currentTasks.map((task) => (
                        <li key={task._id} className="flex justify-between items-center bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                                    {task.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                                    {task.description || "Không có mô tả."}
                                </p>
                                <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 gap-x-3 gap-y-1">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-400">📅</span>
                                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Chưa có hạn"}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-400">🚩</span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-400">📋</span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleEdit(task)} className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                                    Sửa
                                </button>
                                <button onClick={() => handleDelete(task._id)} className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                                    Xóa
                                </button>
                            </div>
                            <TaskEditModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                task={selectedTask}
                                onSave={handleSaveTask}
                            />
                        </li>
                    ))}
                </ul>

                <div className="mt-4 flex justify-center">
                    <ReactPaginate
                        previousLabel={"←"}
                        nextLabel={"→"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={"flex space-x-2"}
                        pageClassName={"px-3 py-1 border rounded"}
                        activeClassName={"bg-blue-500 text-white"}
                        previousClassName={"px-3 py-1 border rounded"}
                        nextClassName={"px-3 py-1 border rounded"}
                        disabledClassName={"opacity-50"}
                    />
                </div>
            </div>
            {/* Danh sách Task - End */}
        </div>
    );
};

{/*  Hàm helper đổi màu theo priority */ }
const getPriorityColor = (priority) => {
    switch (priority) {
        case "High":
            return "bg-red-500 text-white";
        case "Medium":
            return "bg-yellow-500 text-white";
        case "Low":
            return "bg-green-500 text-white";
        default:
            return "bg-gray-300";
    }
};
{/*  Hàm helper đổi màu theo status */ }
const getStatusColor = (priority) => {
    switch (priority) {
        case "in-progress":
            return "bg-blue-500 text-white";
        case "Pending":
            return "bg-yellow-500 text-white";
        case "completed":
            return "bg-green-500 text-white";
        default:
            return "bg-gray-300";
    }
};
export default CreateTaskForm;

// {/* <div className="mt-6">
// <ul className="space-y-3">
//     {tasks.map((task) => (
//         <li
//             key={task._id}
//             className="flex justify-between items-center bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition"
//         >
//             {/* Nội dung bên trái */}
//             <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
//                     {task.title}
//                 </h3>
//                 <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
//                     {task.description || "Không có mô tả."}
//                 </p>
//                 <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 gap-x-3 gap-y-1">
//                     <div className="flex items-center space-x-1">
//                         <span className="text-gray-400">📅</span>
//                         <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Chưa có hạn"}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                         <span className="text-gray-400">🚩</span>
//                         <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
//                             {task.priority}
//                         </span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                         <span className="text-gray-400">📋</span>
//                         <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
//                             {task.status}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Khu vực nút bấm */}
//             <div className="flex items-center space-x-2">
//                 <button
//                     onClick={() => handleEdit(task)}
//                     className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//                 >
//                     Sửa
//                 </button>
//                 <button
//                     onClick={() => handleDelete(task._id)}
//                     className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition"
//                 >
//                     Xóa
//                 </button>
//             </div>
//             <TaskEditModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 task={selectedTask}
//                 onSave={handleSaveTask}
//             />
//         </li>
//     ))}
// </ul>

// </div> */}