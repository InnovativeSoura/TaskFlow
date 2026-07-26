import { motion } from "framer-motion";
import {
  FaQuoteLeft,
  FaUsers,
  FaAward,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";

import "./Testimonials.css";

const testimonials = [
  {
    name: "Nicholas Johnson",
    role: "Project Manager",
    company: "TechNova",
    avatar: "NJ",
    review:
      "TaskFlow transformed the way our team manages projects. Planning, collaboration and delivery are now significantly faster and more organized.",
  },
  {
    name: "Michael Chen",
    role: "Product Lead",
    company: "InnovateX",
    avatar: "MC",
    review:
      "The dashboard, analytics and Kanban workflow have dramatically improved collaboration across our engineering teams.",
  },
  {
    name: "Emily Davis",
    role: "Operations Manager",
    company: "CloudWorks",
    avatar: "ED",
    review:
      "TaskFlow is one of the most intuitive project management platforms we've used. Our productivity has increased tremendously.",
  },
];

const summaryCards = [
  {
    icon: <FaAward />,
    title: "4.9/5",
    description:
      "Average customer satisfaction from thousands of users worldwide.",
  },
  {
    icon: <FaUsers />,
    title: "98%",
    description:
      "Customer retention through better collaboration and streamlined workflows.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7",
    description:
      "Reliable cloud platform with continuous monitoring and dedicated support.",
  },
];

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="testimonials-section"
    >
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-tag">
          Testimonials
        </span>

        <h2>
          Trusted by thousands of professionals
        </h2>

        <p>
          Businesses around the world rely on TaskFlow
          every day to organize projects and improve
          collaboration.
        </p>
      </motion.div>

      <div className="testimonials-grid">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.name}
            className="testimonial-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              duration: 0.6,
            }}
            whileHover={{ y: -10 }}
          >
            <div className="quote-icon">
              <FaQuoteLeft />
            </div>

            <div className="testimonial-rating">
              <FaCheckCircle />
              <FaCheckCircle />
              <FaCheckCircle />
              <FaCheckCircle />
              <FaCheckCircle />
            </div>

            <p className="testimonial-review">
              "{item.review}"
            </p>

            <div className="testimonial-user">
              <div className="testimonial-avatar">
                {item.avatar}
              </div>

              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
                <small>{item.company}</small>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="testimonial-summary"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {summaryCards.map((card) => (
          <motion.div
            key={card.title}
            className="summary-card"
            whileHover={{ y: -8 }}
          >
            <div className="summary-stars">
              {card.icon}
            </div>

            <h2>{card.title}</h2>

            {card.title === "4.9/5" && (
              <div className="summary-stars">
                <FaCheckCircle />
                <FaCheckCircle />
                <FaCheckCircle />
                <FaCheckCircle />
                <FaCheckCircle />
              </div>
            )}

            <p>{card.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        style={{
          marginTop: "70px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "20px 28px",
            borderRadius: "18px",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.08)",
            backdropFilter: "blur(15px)",
          }}
        >
          <FaAward
            style={{
              fontSize: 26,
              color: "#7c4dff",
            }}
          />

          <div>
            <strong>
              Award Winning Productivity Platform
            </strong>

            <p
              style={{
                color: "#94a3b8",
                marginTop: 6,
              }}
            >
              Helping teams deliver projects
              faster every day.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Testimonials;