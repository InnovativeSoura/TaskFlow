import { motion } from "framer-motion";
import {
  FaStar,
  FaQuoteLeft,
} from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Project Manager",
    company: "TechNova",
    avatar: "SJ",
    rating: 5,
    review:
      "TaskFlow transformed the way our team manages projects. Everything from planning to execution is now much faster and more organized.",
  },
  {
    name: "Michael Chen",
    role: "Product Lead",
    company: "InnovateX",
    avatar: "MC",
    rating: 5,
    review:
      "The dashboard, analytics and Kanban workflow have dramatically improved collaboration across our engineering teams.",
  },
  {
    name: "Emily Davis",
    role: "Operations Manager",
    company: "CloudWorks",
    avatar: "ED",
    rating: 5,
    review:
      "TaskFlow is one of the most intuitive project management platforms we've used. Our productivity has increased significantly.",
  },
];

function Testimonials() {
  return (
    <section className="testimonials-section">

      <div className="section-heading">

        <span className="section-tag">
          Testimonials
        </span>

        <h2>
          Loved by teams around the world
        </h2>

        <p>
          Thousands of professionals trust
          TaskFlow to manage projects and
          deliver results faster.
        </p>

      </div>

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

            <p className="testimonial-review">
              "{item.review}"
            </p>

            <div className="testimonial-user">

              <div className="testimonial-avatar">
                {item.avatar}
              </div>

              <div>

                <h4>
                  {item.name}
                </h4>

                <span>
                  {item.role}
                </span>

                <small>
                  {item.company}
                </small>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

      <motion.div
        className="testimonial-summary"
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
          duration: 0.8,
        }}
      >

        <div className="summary-card">

          <h2>
            4.9<span>/5</span>
          </h2>

          <div className="summary-stars">

            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />

          </div>

          <p>
            Average customer rating from
            thousands of satisfied users.
          </p>

        </div>

        <div className="summary-card">

          <h2>
            98%
          </h2>

          <p>
            Customer retention achieved
            through better collaboration
            and productivity.
          </p>

        </div>

        <div className="summary-card">

          <h2>
            24/7
          </h2>

          <p>
            Reliable cloud platform with
            continuous monitoring and
            dedicated support.
          </p>

        </div>

      </motion.div>

    </section>
  );
}

export default Testimonials;