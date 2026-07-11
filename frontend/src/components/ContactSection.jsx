import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

import "../styles/ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thank you! We'll contact you soon.");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section
      className="contact-section"
      id="contact"
    >
      <div className="contact-container">

        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">
            CONTACT US
          </span>

          <h2>Let's Build Something Amazing</h2>

          <p>
            Have questions about TaskFlow?
            We'd love to hear from you.
          </p>

          <div className="contact-item">
            <FaEnvelope />
            <span>support@taskflow.com</span>
          </div>

          <div className="contact-item">
            <FaPhoneAlt />
            <span>+91 8100181321</span>
          </div>

          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>Kolkata, West Bengal, India</span>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            rows="6"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Send Message
            <FaPaperPlane />
          </button>
        </motion.form>

      </div>
    </section>
  );
};

export default ContactSection;