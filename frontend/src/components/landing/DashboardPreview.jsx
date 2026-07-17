import { motion } from "framer-motion";
import {
  FaTasks,
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const DashboardPreview = () => {
  return (
    <section className="dashboard-preview">

      <div className="section-heading">

        <span className="section-tag">
          Dashboard Preview
        </span>

        <h2>
          Everything your team needs in one workspace
        </h2>

        <p>
          Manage projects, collaborate with teammates,
          monitor performance, and track progress using a
          clean, modern dashboard.
        </p>

      </div>

      <motion.div
        className="dashboard-preview-window"
        initial={{
          opacity: 0,
          y: 60,
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
              <FaChartLine />
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

            {/* Top Cards */}

            <div className="preview-stats">

              <div className="preview-stat-card">

                <FaTasks />

                <h3>124</h3>

                <p>Total Tasks</p>

              </div>

              <div className="preview-stat-card">

                <FaUsers />

                <h3>18</h3>

                <p>Team Members</p>

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
                  Project Progress
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
                Mobile Application Development
              </p>

            </div>

            {/* Kanban */}

            <div className="preview-kanban">

              <div className="kanban-column">

                <h4>
                  To Do
                </h4>

                <div className="kanban-card">
                  UI Design
                </div>

                <div className="kanban-card">
                  API Integration
                </div>

              </div>

              <div className="kanban-column">

                <h4>
                  In Progress
                </h4>

                <div className="kanban-card active">
                  Dashboard
                </div>

              </div>

              <div className="kanban-column">

                <h4>
                  Completed
                </h4>

                <div className="kanban-card success">

                  <FaCheckCircle />

                  Authentication

                </div>

                <div className="kanban-card success">

                  <FaCheckCircle />

                  Database

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
                  5 min ago
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
                  Team Meeting
                </strong>

                <span>
                  Tomorrow
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