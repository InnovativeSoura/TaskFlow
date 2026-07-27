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
    name: "Nicholas Johnson",
    role: "Project Manager",
    company: "TechNova",
    initials: "NJ",
    quote:
      "TaskFlow transformed the way our team manages projects. Collaboration and delivery are now significantly faster and more organized.",
    variant: "purple",
  },
  {
    name: "Michael Chen",
    role: "Product Lead",
    company: "InnovateX",
    initials: "MC",
    quote:
      "The dashboard, analytics and Kanban workflow have dramatically improved collaboration across our engineering teams.",
    variant: "blue",
  },
  {
    name: "Emily Davis",
    role: "Operations Manager",
    company: "CloudWorks",
    initials: "ED",
    quote:
      "TaskFlow is one of the most intuitive project management platforms we've used. Our productivity has increased tremendously.",
    variant: "cyan",
  },
];

const metrics = [
  {
    icon: FaUsers,
    value: "4.9/5",
    title: "Customer Satisfaction",
    description:
      "Average customer satisfaction from thousands of users worldwide.",
    stars: true,
    variant: "purple",
  },
  {
    icon: FaShieldAlt,
    value: "98%",
    title: "Customer Retention",
    description:
      "Customer retention through better collaboration and streamlined workflows.",
    variant: "blue",
  },
  {
    icon: FaHeadset,
    value: "24/7",
    title: "Always-On Support",
    description:
      "Reliable cloud platform with continuous monitoring and dedicated support.",
    variant: "cyan",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <motion.div
        className="testimonials-header"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
      >
        <span className="testimonials-eyebrow">
          TRUSTED BY MODERN TEAMS
        </span>

        <h2 className="testimonials-title">
          Loved by teams that
          <span> get things done.</span>
        </h2>

        <p className="testimonials-subtitle">
          Businesses around the world rely on TaskFlow every day
          to organize projects, improve collaboration and deliver
          better results.
        </p>

        <div className="testimonials-header-line">
          <span />
          <div className="header-stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <span />
        </div>
      </motion.div>


      {/* =====================================================
          TESTIMONIAL CARDS
      ===================================================== */}
      <div className="testimonials-grid">

        {testimonials.map((testimonial, index) => (
          <motion.article
            key={testimonial.name}
            className={`testimonial-card testimonial-${testimonial.variant}`}
            initial={{
              opacity: 0,
              y: 55,
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

            {/* Glow */}
            <div className="testimonial-card-glow" />

            {/* Top */}
            <div className="testimonial-top">

              <div className="testimonial-quote-icon">
                <FaQuoteLeft />
              </div>

              <div className="testimonial-rating">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

            </div>


            {/* Quote */}
            <p className="testimonial-quote">
              "{testimonial.quote}"
            </p>


            {/* Divider */}
            <div className="testimonial-divider" />


            {/* User */}
            <div className="testimonial-user">

              <div className="testimonial-avatar">
                {testimonial.initials}
              </div>

              <div className="testimonial-user-info">
                <strong>{testimonial.name}</strong>

                <span>
                  {testimonial.role}
                </span>

                <small>
                  {testimonial.company}
                </small>
              </div>

            </div>


            {/* Decorative quote */}
            <div className="testimonial-large-quote">
              ”
            </div>

          </motion.article>
        ))}

      </div>


      {/* =====================================================
          METRICS
      ===================================================== */}
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
          duration: 0.7,
          delay: 0.15,
        }}
      >

        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <motion.div
              key={metric.title}
              className={`testimonial-metric metric-${metric.variant}`}
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: 0.25,
              }}
            >

              <div className="metric-icon">
                <Icon />
              </div>

              <div className="metric-content">

                <div className="metric-value-row">
                  <strong>
                    {metric.value}
                  </strong>

                  {metric.stars && (
                    <div className="metric-stars">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  )}
                </div>

                <span className="metric-title">
                  {metric.title}
                </span>

                <p>
                  {metric.description}
                </p>

              </div>

            </motion.div>
          );
        })}

      </motion.div>


      {/* =====================================================
          AWARD BADGE
      ===================================================== */}
      <motion.div
        className="award-wrapper"
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
          amount: 0.3,
        }}
        transition={{
          duration: 0.65,
          delay: 0.25,
        }}
      >

        <div className="award-card">

          <div className="award-icon">
            <FaAward />
          </div>

          <div className="award-content">
            <strong>
              Award Winning Productivity Platform
            </strong>

            <span>
              Helping teams deliver projects faster every day.
            </span>
          </div>

          <div className="award-shine" />

        </div>

      </motion.div>

    </section>
  );
};

export default Testimonials;