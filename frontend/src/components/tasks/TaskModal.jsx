import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/TaskModal.css";

import {
  FaTimes,
  FaTasks,
  FaAlignLeft,
  FaCalendarAlt,
  FaFlag,
  FaLayerGroup,
  FaChartLine,
  FaFolderOpen,
  FaUser,
  FaSave,
} from "react-icons/fa";

const priorities = ["Low", "Medium", "High", "Critical"];

const statuses = ["Pending", "In Progress", "Review", "Completed"];

const defaultForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  progress: 0,
  dueDate: "",
  project: "",
  assignee: "",
};

function TaskModal({
  open,
  task,
  loading = false,
  projects = [],
  users = [],
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!task) {
      setForm(defaultForm);
      return;
    }

    setForm({
      title: task.title || "",
      description: task.description || "",

      priority: task.priority || "Medium",

      status: task.status || "Pending",

      progress: task.progress ?? 0,

      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",

      project: task.project?._id || task.project || "",

      assignee: task.assignee?._id || task.assignee || "",
    });
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    onSave?.({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  const backdropVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 30,
    },

    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.28,
      },
    },

    exit: {
      opacity: 0,
      scale: 0.92,
      y: 20,
      transition: {
        duration: 0.18,
      },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="task-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="task-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="task-modal-header">
              <div className="modal-title">
                <div className="modal-icon">
                  <FaTasks />
                </div>

                <div>
                  <h2>{task ? "Edit Task" : "Create New Task"}</h2>

                  <p>
                    {task
                      ? "Update your existing task."
                      : "Create and organize your work efficiently."}
                  </p>
                </div>
              </div>

              <button className="modal-close" type="button" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            <form className="task-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <FaTasks />
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter task title..."
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaAlignLeft />
                  Description
                </label>

                <textarea
                  name="description"
                  rows={5}
                  placeholder="Describe your task..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaFlag />
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <FaLayerGroup />
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaCalendarAlt />
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="progress-label">
                    <span>
                      <FaChartLine />
                      Progress
                    </span>

                    <strong>{form.progress}%</strong>
                  </label>

                  <input
                    type="range"
                    name="progress"
                    min="0"
                    max="100"
                    step="5"
                    value={form.progress}
                    onChange={handleChange}
                    className="progress-slider"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaFolderOpen />
                    Project
                  </label>

                  <select
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                  >
                    <option value="">Select Project</option>

                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title || project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <FaUser />
                    Assignee
                  </label>

                  <select
                    name="assignee"
                    value={form.assignee}
                    onChange={handleChange}
                  >
                    <option value="">Unassigned</option>

                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.div
                className="task-preview"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >
                <div className="preview-header">
                  <h4>Live Preview</h4>

                  <span
                    className={`preview-priority priority-${form.priority.toLowerCase()}`}
                  >
                    {form.priority}
                  </span>
                </div>

                <h3>{form.title || "Task title"}</h3>

                <p>
                  {form.description || "Task description will appear here..."}
                </p>

                <div className="preview-footer">
                  <span>Status: {form.status}</span>

                  <span>Progress: {form.progress}%</span>
                </div>
              </motion.div>

              <div className="task-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !form.title.trim()}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {task ? "Update Task" : "Create Task"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TaskModal;
