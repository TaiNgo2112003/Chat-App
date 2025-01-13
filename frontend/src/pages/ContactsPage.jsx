import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send } from "lucide-react";
import { useState } from "react";
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaTelegramPlane, FaTiktok } from "react-icons/fa";

// Static preview messages
const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

// Sidebar options
const SIDEBAR_OPTIONS = [
  { id: "listFriends", label: "List Friend" },
  { id: "listGroups", label: "List Groups & Community" },
  { id: "listSend", label: "List Submit Request Contact" },
  { id: "listReceived", label: "List Received Request Contact" },
  { id: "feedback", label: "Feedback" },
];

const ContactsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();
  const [selectedOption, setSelectedOption] = useState("theme"); // Default selected option

  // Render functions for each section
  const renderListFriend = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h2 className="text-xl font-bold">Friend List</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search friends..."
        className="input input-bordered w-full sm:w-1/2"
      />

      {/* Filters */}
      <div className="flex space-x-2 mt-2">
        <button className="btn btn-primary">All</button>
        <button className="btn btn-outline">Online</button>
        <button className="btn btn-outline">Offline</button>
      </div>

      {/* Friend list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Alice</h3>
            <p className="text-sm text-gray-600">Online</p>
          </div>
          <button className="btn btn-sm btn-error">Remove</button>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Bob</h3>
            <p className="text-sm text-gray-600">Offline</p>
          </div>
          <button className="btn btn-sm btn-error">Remove</button>
        </div>
      </div>
    </div>
  );


  const renderlistGroups = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h2 className="text-xl font-bold">Group List</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search groups..."
        className="input input-bordered w-full sm:w-1/2"
      />

      {/* Filter options */}
      <div className="flex space-x-2 mt-2">
        <button className="btn btn-primary">All</button>
        <button className="btn btn-outline">My Groups</button>
        <button className="btn btn-outline">Public</button>
      </div>

      {/* Group list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Group A</h3>
            <p className="text-sm text-gray-600">Public</p>
          </div>
          <button className="btn btn-sm btn-info">Join</button>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Group B</h3>
            <p className="text-sm text-gray-600">Private</p>
          </div>
          <button className="btn btn-sm btn-info">Join</button>
        </div>
      </div>
    </div>
  );


  const renderlistSend = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h2 className="text-xl font-bold">Sent Friend Requests</h2>

      {/* Filter options */}
      <div className="flex space-x-2 mt-2">
        <button className="btn btn-primary">All</button>
        <button className="btn btn-outline">Pending</button>
        <button className="btn btn-outline">Accepted</button>
        <button className="btn btn-outline">Rejected</button>
      </div>

      {/* Sent requests list */}
      <div className="space-y-3 mt-4">
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold">John Doe</h3>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <button className="btn btn-sm btn-warning">Cancel Request</button>
        </div>
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold">Jane Smith</h3>
            <p className="text-sm text-gray-600">Accepted</p>
          </div>
          <span className="text-sm text-green-500">Accepted</span>
        </div>
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold">Bob Johnson</h3>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
          <span className="text-sm text-red-500">Rejected</span>
        </div>
      </div>
    </div>
  );




  const renderlistReceived = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h2 className="text-xl font-bold">Received Friend Requests</h2>

      {/* Filter options */}
      <div className="flex space-x-2 mt-2">
        <button className="btn btn-primary">All</button>
        <button className="btn btn-outline">Pending</button>
        <button className="btn btn-outline">Accepted</button>
        <button className="btn btn-outline">Rejected</button>
      </div>

      {/* Received requests list */}
      <div className="space-y-3 mt-4">
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold">Alice Cooper</h3>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="flex space-x-2">
            <button className="btn btn-sm btn-success">Accept</button>
            <button className="btn btn-sm btn-danger">Reject</button>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold">Charlie Brown</h3>
            <p className="text-sm text-gray-600">Accepted</p>
          </div>
          <span className="text-sm text-green-500">Accepted</span>
        </div>
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-lg font-semibold">David Lee</h3>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
          <span className="text-sm text-red-500">Rejected</span>
        </div>
      </div>
    </div>
  );



  const renderFeedbackSection = () => (
    <div>
      <h2 className="text-lg font-semibold">Feedback</h2>
      <p className="text-sm text-base-content/70">We value your feedback</p>
      <textarea
        className="textarea textarea-bordered w-full mt-4"
        placeholder="Share your feedback here..."
      ></textarea>
      <button className="btn btn-primary mt-2">Submit</button>
    </div>
  );



  // Render selected option
  const renderContent = () => {
    switch (selectedOption) {
      case "listFriends":
        return renderListFriend();
      case "listGroups":
        return renderlistGroups();
      case "listSend":
        return renderlistSend();
      case "listReceived":
        return renderlistReceived();
      case "feedback":
        return renderFeedbackSection();
      default:
        return renderListFriend();
    }
  };

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-base-200 rounded-lg p-4 space-y-4">
        {SIDEBAR_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={`block w-full text-left p-2 rounded-lg ${selectedOption === option.id
              ? "bg-primary text-primary-content"
              : "hover:bg-base-300"
              }`}
            onClick={() => setSelectedOption(option.id)}
          >
            {option.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default ContactsPage;
