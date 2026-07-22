import { motion } from "framer-motion";
import {
  FaStar,
  FaQuoteLeft,
  FaUsers,
  FaAward,
  FaHeadset,
} from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Project Manager",
    company: "TechNova",
    avatar: "SJ",
    rating: 5,
    review:
      "TaskFlow transformed the way our team manages projects. Planning, collaboration and delivery are now significantly faster and more organized.",
  },
  {
    name: "Michael Chen",
    role: "Product Lead",
    company: "InnovateX",
    avatar: "MC",
    rating: 5,
    review:
      "The dashboard, analytics and Kanban workflow have dramatically improved collaboration across our engineering teams. It's become our daily workspace.",
  },
  {
    name: "Emily Davis",
    role: "Operations Manager",
    company: "CloudWorks",
    avatar: "ED",
    rating: 5,
    review:
      "TaskFlow is one of the most intuitive project management platforms we've used. Our productivity and project visibility have increased tremendously.",
  },
];

const summaryCards = [
  {
    icon: <FaStar />,
    title: "4.9/5",
    description:
      "Average customer rating from thousands of satisfied users worldwide.",
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
      {/* Heading */}

      <motion.div
        className="section-heading"
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <span className="section-tag">
          Testimonials
        </span>

        <h2>
          Trusted by thousands of
          professionals worldwide
        </h2>

        <p>
          Businesses, startups and remote
          teams rely on TaskFlow every day
          to organize projects, improve
          collaboration and deliver work
          faster.
        </p>
      </motion.div>

      {/* Testimonials */}

      <div className="testimonials-grid">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.name}
            className="testimonial-card"
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: index * 0.15,
              duration: 0.6,
            }}
            whileHover={{
              y: -10,
            }}
          >
            <div className="quote-icon">
              <FaQuoteLeft />
            </div>

            <div className="testimonial-rating">
              {Array.from({
                length: item.rating,
              }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <p
              className="testimonial-review"
              style={{
                marginBottom: "30px",
                lineHeight: "1.9",
                color: "#cbd5e1",
                minHeight: "135px",
              }}
            >
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

      {/* Summary */}

      <motion.div
        className="testimonial-summary"
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        {summaryCards.map((card) => (
          <motion.div
            key={card.title}
            className="summary-card"
            whileHover={{
              y: -8,
            }}
          >
            <div className="summary-stars">
              {card.icon}
            </div>

            <h2>{card.title}</h2>

            {card.title === "4.9/5" && (
              <div className="summary-stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            )}

            <p>{card.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Trust Badge */}

      <motion.div
        style={{
          marginTop: "80px",
          display: "flex",
          justifyContent: "center",
        }}
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "18px 30px",
            borderRadius: "20px",
            background: "rgba(255,255,255,.05)",
            border:
              "1px solid rgba(255,255,255,.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <FaAward
            style={{
              color: "#818cf8",
              fontSize: "24px",
            }}
          />

          <div>
            <strong>
              Award Winning Productivity
              Platform
            </strong>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "5px",
              }}
            >
              Helping organizations improve
              productivity since day one.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Testimonials;