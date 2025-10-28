import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import "../styles/ContactUs.css";

const ContactUs = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState({
    email: true,
    phone: true,
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        role: user.role || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
      setIsEditable({
        email: false,
        phone: true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/contact/submit", formData);
      toast.success("✅ Message sent successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
      setFormData(prev => ({
        ...prev,
        message: "",
      }));
    } catch (error) {
      toast.error("⚠️ Something went wrong. Try again!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <ToastContainer />
      <div className="contact-title">
        <h2>Contact Us</h2>
        <p>FOR PERSONALIZED ADVICE ABOUT YOUR SITUATION</p>
      </div>
      <form className="contact-box" onSubmit={handleSubmit}>
        <div className="contact-row">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="contact-input"
            value={formData.name}
            onChange={handleChange}
            readOnly={!!user}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="contact-input"
            value={formData.email}
            onChange={handleChange}
            readOnly={!isEditable.email}
            required
          />
        </div>
        <div className="contact-row">
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone"
            className="contact-input"
            value={formData.phone}
            onChange={handleChange}
            readOnly={!isEditable.phone}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Your Role"
            className="contact-input"
            value={formData.role}
            onChange={handleChange}
            readOnly={!!user}
            required
          />
        </div>
        <textarea
          name="message"
          placeholder="Your Message"
          className="contact-textarea"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="contact-button" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
