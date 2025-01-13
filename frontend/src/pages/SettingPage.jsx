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
  { id: "theme", label: "Theme" },
  { id: "language", label: "Language" },
  { id: "faq", label: "FAQs" },
  { id: "contact", label: "Contact Support" },
  { id: "feedback", label: "Feedback" },
  { id: "apps", label: "Connected Apps" },
  { id: "version", label: "App Version" },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();
  const [selectedOption, setSelectedOption] = useState("theme"); // Default selected option

  // Render functions for each section
  const renderThemeSection = () => (
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Theme</h2>
        <p className="text-sm text-base-content/70">
          Choose a theme for your chat interface
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {THEMES.map((t) => (
          <button
            key={t}
            className={`group flex flex-col items-center gap-1.5 p-1.5 rounded-lg transition-colors ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}`}
            onClick={() => setTheme(t)}
          >
            <div className="relative h-6 w-full rounded-md overflow-hidden" data-theme={t}>
              <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                <div className="rounded bg-primary"></div>
                <div className="rounded bg-secondary"></div>
                <div className="rounded bg-accent"></div>
                <div className="rounded bg-neutral"></div>
              </div>
            </div>
            <span className="text-[10px] font-medium truncate w-full text-center">
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
          </button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">Preview</h3>
      <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
        <div className="p-3 bg-base-200">
          <div className="max-w-sm mx-auto">
            {/* Mock Chat UI */}
            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
              {/* Chat Header */}
              <div className="px-3 py-2 border-b border-base-300 bg-base-100">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium text-xs">
                    J
                  </div>
                  <div>
                    <h3 className="font-medium text-xs">
                      {authUser.user?.fullName || authUser.fullName || "No data available"}
                    </h3>
                    <p className="text-[9px] text-base-content/70">Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-3 space-y-3 min-h-[140px] max-h-[140px] overflow-y-auto bg-base-100">
                {PREVIEW_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[60%] rounded-xl p-2 shadow-sm
                        ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                      `}
                    >
                      <p className="text-xs">{message.content}</p>
                      <p
                        className={`
                          text-[8px] mt-1.5
                          ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                        `}
                      >
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-base-300 bg-base-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-xs h-7"
                    placeholder="Type a message..."
                    value="This is a preview"
                    readOnly
                  />
                  <button className="btn btn-primary h-7 min-h-0">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const renderLanguageSection = () => (
    <div>
      <h2 className="text-lg font-semibold">Language</h2>
      <p className="text-sm text-base-content/70">
        Select your preferred language
      </p>
      <select className="select select-bordered w-full mt-4">
        <option>English</option>
        <option>Vietnamese</option>
        <option>French</option>
        <option>Spanish</option>
      </select>
    </div>
  );

  const renderFAQsSection = () => (
    <div>
      <h2 className="text-lg font-semibold">FAQs</h2>
      <p className="text-sm text-base-content/70">Frequently Asked Questions</p>
      <ul className="mt-4 list-disc list-inside">
        <li>How do I change my password?</li>
        <li>How can I contact support?</li>
        <li>Where can I find app updates?</li>
      </ul>
    </div>
  );



  const renderContactSupportSection = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {/* Email */}
        <a href="mailto:taingo2112003@gmail.com" className="flex flex-col items-center text-gray-700 hover:text-primary transition-all">
          <FaEnvelope size={30} />
          <span className="text-sm mt-2">Email</span>
        </a>

        {/* Phone */}
        <a href="tel:+84962126912" className="flex flex-col items-center text-gray-700 hover:text-primary transition-all">
          <FaPhone size={30} />
          <span className="text-sm mt-2">Phone</span>
        </a>


        {/* Facebook */}
        <a href="https://www.facebook.com/bin.map211" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-700 hover:text-primary transition-all">
          <FaFacebook size={30} />
          <span className="text-sm mt-2">Facebook</span>
        </a>


        {/* Instagram */}
        <a href="https://www.instagram.com/taingo_210103/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-700 hover:text-primary transition-all">
          <FaInstagram size={30} />
          <span className="text-sm mt-2">Instagram</span>
        </a>

        {/* Tiktok */}
        <a href="https://www.tiktok.com/@anzkdh0282?lang=vi-VN" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-700 hover:text-primary transition-all">
          <FaTiktok size={30} />
          <span className="text-sm mt-2">Tiktok</span>
        </a>

        {/* LinkedIn */}
        <a href="https://www.linkedin.com/in/t%C3%A0i-ng%C3%B4-3b84a7220/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-700 hover:text-primary transition-all">
          <FaLinkedin size={30} />
          <span className="text-sm mt-2">LinkedIn</span>
        </a>

        {/* GitHub */}
        <a href="https://github.com/TaiNgo2112003" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-700 hover:text-primary transition-all">
          <FaGithub size={30} />
          <span className="text-sm mt-2">GitHub</span>
        </a>

        {/* Telegram */}
        <a href="https://web.telegram.org/k/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-700 hover:text-primary transition-all">
          <FaTelegramPlane size={30} />
          <span className="text-sm mt-2">Telegram</span>
        </a>
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

  const renderConnectedAppsSection = () => (
    <div>
      <h2 className="text-lg font-semibold">Connected Apps</h2>
      <p className="text-sm text-base-content/70">
        Manage apps connected to your account
      </p>
      <ul className="mt-4 list-disc list-inside">
        <li>Google Drive</li>
        <li>Dropbox</li>
        <li>Slack</li>
      </ul>
    </div>
  );

  const renderAppVersionSection = () => (
    <div>
      <h2 className="text-lg font-semibold">App Version</h2>
      <p className="text-sm text-base-content/70">
        Current Version: <span className="font-medium">1.0.0</span>
      </p>
    </div>
  );

  // Render selected option
  const renderContent = () => {
    switch (selectedOption) {
      case "theme":
        return renderThemeSection();
      case "language":
        return renderLanguageSection();
      case "faq":
        return renderFAQsSection();
      case "contact":
        return renderContactSupportSection();
      case "feedback":
        return renderFeedbackSection();
      case "apps":
        return renderConnectedAppsSection();
      case "version":
        return renderAppVersionSection();
      default:
        return <div>Select an option from the sidebar</div>;
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

export default SettingsPage;
