import { motion } from "framer-motion";
import {
  FaQuoteLeft,
  FaStar,
  FaUsers,
  FaShieldAlt,
  FaHeadset,
  FaAward,
} from "react-icons/fa";

import "./Testimonials.css";

const testimonials = [
  {
    quote:
      "TaskFlow transformed the way our team manages projects. Collaboration and delivery are now significantly faster and more organized.",
    name: "Nicholas Johnson",
    role: "Project Manager",
    company: "TechNova",
    initials: "NJ",
    iconClass: "purple",
  },
  {
    quote:
      "The dashboard, analytics and Kanban workflow have dramatically improved collaboration across our engineering teams.",
    name: "Michael Chen",
    role: "Product Lead",
    company: "InnovateX",
    initials: "MC",
    iconClass: "blue",
  },
  {
    quote:
      "TaskFlow is one of the most intuitive project management platforms we've used. Our productivity has increased tremendously.",
    name: "Emily Davis",
    role: "Operations Manager",
    company: "CloudWorks",
    initials: "ED",
    iconClass: "cyan",
  },
];

const metrics = [
  {
    value: "4.9/5",
    description:
      "Average customer satisfaction from thousands of users worldwide.",
    icon: FaUsers,
    className: "purple",
  },
  {
    value: "98%",
    description:
      "Customer retention through better collaboration and streamlined workflows.",
    icon: FaShieldAlt,
    className: "blue",
  },
  {
    value: "24/7",
    description:
      "Reliable cloud platform with continuous monitoring and dedicated support.",
    icon: FaHeadset,
    className: "cyan",
  },
];

const Testimonials = () => {
  return (
    <section
      className="testimonials-section"
      id="testimonials"
    >
      {/* ==========================================
          BACKGROUND EFFECTS
      ========================================== */}

      <div className="testimonials-glow testimonials-glow-left" />
      <div className="testimonials-glow testimonials-glow-right" />

      <div className="testimonial-orb testimonial-orb-one" />
      <div className="testimonial-orb testimonial-orb-two" />

      <div className="testimonials-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <motion.div
          className="testimonials-header"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <span className="testimonials-badge">
            TESTIMONIALS
          </span>

          <div className="testimonials-heading-row">

            <div className="heading-decoration left">
              <span />
              <span />
              <span />
              <span />
            </div>

            <h2>
              Trusted by thousands
              <br />
              of{" "}
              <span>
                professionals
              </span>
            </h2>

            <div className="heading-decoration right">
              <span />
              <span />
              <span />
              <span />
            </div>

          </div>

          <p className="testimonials-subtitle">
            Businesses around the world rely on TaskFlow
            every day to organize projects and improve
            collaboration.
          </p>
        </motion.div>

        {/* ==========================================
            TESTIMONIAL CARDS
        ========================================== */}

        <div className="testimonial-grid">

          {testimonials.map((item, index) => {
            return (
              <motion.article
                className={`testimonial-card ${item.iconClass}`}
                key={item.name}
                initial={{
                  opacity: 0,
                  y: 45,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -10,
                }}
              >

                {/* Card top */}

                <div className="testimonial-card-top">

                  <div className="quote-icon">
                    <FaQuoteLeft />
                  </div>

                  <div className="testimonial-stars">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <FaStar key={star} />
                      )
                    )}
                  </div>

                </div>

                {/* Quote */}

                <p className="testimonial-quote">
                  "{item.quote}"
                </p>

                {/* User */}

                <div className="testimonial-user">

                  <div className="testimonial-avatar">
                    {item.initials}
                  </div>

                  <div className="testimonial-user-info">
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.role}
                    </span>

                    <small>
                      {item.company}
                    </small>
                  </div>

                </div>

                {/* Decorative quote */}

                <FaQuoteLeft className="background-quote" />

              </motion.article>
            );
          })}

        </div>

        {/* ==========================================
            METRICS PANEL
        ========================================== */}

        <motion.div
          className="testimonial-metrics"
          initial={{
            opacity: 0,
            y: 45,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
          }}
        >

          <div className="metrics-wave metrics-wave-left" />
          <div className="metrics-wave metrics-wave-right" />

          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <motion.div
                className={`metric-item ${metric.className}`}
                key={metric.value}
                whileHover={{
                  scale: 1.025,
                }}
                transition={{
                  duration: 0.25,
                }}
              >

                <div className="metric-icon">
                  <Icon />
                </div>

                <div className="metric-content">

                  <div className="metric-value">
                    {metric.value}
                  </div>

                  <div className="metric-line" />

                  <p>
                    {metric.description}
                  </p>

                  {index === 0 && (
                    <div className="metric-stars">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <FaStar key={star} />
                        )
                      )}
                    </div>
                  )}

                </div>

              </motion.div>
            );
          })}

        </motion.div>

        {/* ==========================================
            AWARD BADGE
        ========================================== */}

        <motion.div
          className="award-badge"
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
        >

          <div className="award-icon">
            <FaAward />
          </div>

          <div className="award-content">
            <strong>
              Award Winning Productivity Platform
            </strong>

            <span>
              Helping teams deliver projects faster
              every day.
            </span>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;