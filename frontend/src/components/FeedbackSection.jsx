import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser"; // dùng SDK mới
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const FeedbackSection = ({ authUser }) => {
  const form = useRef(null);
  const [status, setStatus] = useState("");
  console.log("authUser in feedback", authUser);
  const handleSendFeedback = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .sendForm(
        "service_kframtx",            // SERVICE ID
        "template_8dqmg3o",           // TEMPLATE ID
        form.current,                 // form ref
        "FqyOlbcU31vSkFOFF"           // ✅ PUBLIC KEY
      )
      .then(
        () => {
          toast.success("Feedback sent successfully!");
          form.current.reset();
        },
        (error) => {
          console.error("Failed to send feedback:", error);
          toast.error("Failed to send feedback. Please try again.\n Errror: " + error.text);
        }
      );
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-2">Feedback</h1>
      <p className="text-sm text-base-content/70 mb-4">We value your feedback!</p>
      <form ref={form} onSubmit={handleSendFeedback} className="space-y-3">
        <input
          type="text"
          name="to_name"
          className="input input-bordered w-full"
          placeholder="Your name"
          defaultValue={authUser?.user?.fullName || authUser?.fullName || ""}
          required
        />
        <input
          type="email"
          name="user_email"
          className="input input-bordered w-full"
          placeholder="Your email"
          defaultValue={authUser?.user?.email || authUser?.email || ""}
          required
        />
        <textarea
          name="message"
          className="textarea textarea-bordered w-full"
          placeholder="Your feedback"
          required
        />
        <button type="submit" className="btn btn-primary">
          Send Feedback
        </button>
      </form>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};

export default FeedbackSection;
