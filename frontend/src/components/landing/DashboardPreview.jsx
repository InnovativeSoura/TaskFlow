import { motion } from "framer-motion";
import {
  FaChartPie,
  FaTasks,
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

const DashboardPreview = () => {
  return (
    <section
      id="dashboard"
      className="dashboard-preview"
    >
      {/* Section Heading */}

      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-tag">
          Dashboard Preview
        </span>

        <h2>
          Everything you need in one intelligent workspace
        </h2>

        <p>
          Track projects, monitor productivity,
          collaborate with teammates, organize
          tasks and visualize progress through a
          beautiful modern dashboard.
        </p>
      </motion.div>

      {/* Dashboard Window */}

      <motion.div
        className="dashboard-preview-window"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}

        <div className="preview-header">
          <div className="preview-dots">
            <span />
            <span />
            <span />
          </div>

          <div className="preview-title">
            TaskFlow Dashboard
          </div>
        </div>

        {/* Body */}

        <div className="preview-body">

          {/* Sidebar */}

          <aside className="preview-sidebar">

            <div className="sidebar-item active">
              <FaChartPie />
              Dashboard
            </div>

            <div className="sidebar-item">
              <FaTasks />
              Projects
            </div>

            <div className="sidebar-item">
              <FaCalendarAlt />
              Calendar
            </div>

            <div className="sidebar-item">
              <FaUsers />
              Team
            </div>

          </aside>

          {/* Main */}

          <main className="preview-main">

            {/* Statistics */}

            <div className="preview-stats">

              <div className="preview-stat-card">
                <FaTasks />

                <h3>124</h3>

                <p>Total Tasks</p>
              </div>

              <div className="preview-stat-card">
                <FaUsers />

                <h3>18</h3>

                <p>Active Members</p>
              </div>

              <div className="preview-stat-card">
                <FaChartLine />

                <h3>91%</h3>

                <p>Productivity</p>
              </div>

            </div>

            {/* Progress */}

            <div className="preview-progress">

              <div className="preview-card-header">
                <h3>
                  Mobile Application
                </h3>

                <span>
                  82%
                </span>
              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: "82%",
                  }}
                />

              </div>

              <p>
                Current Sprint Progress
              </p>

            </div>

            {/* Kanban */}

            <div className="preview-kanban">

              {/* Todo */}

              <div className="kanban-column">

                <h4>To Do</h4>

                <div className="kanban-card">
                  Design Login Page
                </div>

                <div className="kanban-card">
                  API Documentation
                </div>

              </div>

              {/* Progress */}

              <div className="kanban-column">

                <h4>
                  In Progress
                </h4>

                <div className="kanban-card active">
                  Dashboard UI
                </div>

                <div className="kanban-card active">
                  Authentication
                </div>

              </div>

              {/* Completed */}

              <div className="kanban-column">

                <h4>
                  Completed
                </h4>

                <div className="kanban-card success">
                  <FaCheckCircle />

                  Database Setup
                </div>

                <div className="kanban-card success">
                  <FaCheckCircle />

                  JWT Login
                </div>

              </div>

            </div>

          </main>

          {/* Activity */}

          <aside className="preview-activity">

            <h3>
              Recent Activity
            </h3>

            <div className="activity-item">

              <FaClock />

              <div>

                <strong>
                  Dashboard Updated
                </strong>

                <span>
                  5 minutes ago
                </span>

              </div>

            </div>

            <div className="activity-item">

              <FaCheckCircle />

              <div>

                <strong>
                  Sprint Completed
                </strong>

                <span>
                  Today
                </span>

              </div>

            </div>

            <div className="activity-item">

              <FaUsers />

              <div>

                <strong>
                  New Team Member Added
                </strong>

                <span>
                  Yesterday
                </span>

              </div>

            </div>

            <div className="activity-item">

              <FaTasks />

              <div>

                <strong>
                  12 Tasks Assigned
                </strong>

                <span>
                  This Week
                </span>

              </div>

            </div>

          </aside>

        </div>
      </motion.div>
    </section>
  );
};

export default DashboardPreview;