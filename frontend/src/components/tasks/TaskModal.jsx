import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaTimes,
  FaTasks,
  FaFolderOpen,
  FaUser,
  FaFlag,
  FaChartLine,
  FaCalendarAlt,
  FaTags,
  FaClock,
  FaAlignLeft,
} from "react-icons/fa";

const initialForm = {
  title: "",
  description: "",
  project: "",
  assignee: "",
  status: "Pending",
  priority: "Medium",
  progress: 0,
  estimatedHours: "",
  labels: "",
  dueDate: "",
};

const TaskModal = ({
  open,
  task,
  onSave,
  onClose,
  projects = [],
  users = [],
}) => {
  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description:
          task.description || "",

        project:
          task.project?._id ||
          task.project ||
          "",

        assignee:
          task.assignee?._id ||
          task.assignee ||
          "",

        status:
          task.status || "Pending",

        priority:
          task.priority || "Medium",

        progress:
          task.progress ?? 0,

        estimatedHours:
          task.estimatedHours || "",

        labels: Array.isArray(
          task.labels
        )
          ? task.labels.join(", ")
          : "",

        dueDate: task.dueDate
          ? task.dueDate.substring(0, 10)
          : "",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [task, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title =
        "Task title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required.";
    }

    if (!form.project) {
      newErrors.project =
        "Please select a project.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await onSave({
        ...form,

        progress: Number(
          form.progress
        ),

        estimatedHours:
          form.estimatedHours === ""
            ? null
            : Number(
                form.estimatedHours
              ),

        labels: form.labels
          .split(",")
          .map((label) =>
            label.trim()
          )
          .filter(Boolean),
      });

      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>

      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <motion.div
          className="modal-content"
          initial={{
            scale: 0.92,
            opacity: 0,
            y: 40,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.92,
            opacity: 0,
            y: 30,
          }}
          transition={{
            duration: 0.25,
          }}
        >

          {/* Header */}

          <div className="modal-header">

            <div>

              <h2 className="modal-title">
                {task
                  ? "Edit Task"
                  : "Create New Task"}
              </h2>

              <p className="text-muted">
                Manage task details and
                assignments.
              </p>

            </div>

            <button
              type="button"
              className="modal-close"
              onClick={onClose}
            >
              <FaTimes />
            </button>

          </div>

          <form
            className="task-form"
            onSubmit={handleSubmit}
          >
                        <div className="form-grid">

              {/* ==========================
                  TASK TITLE
              ========================== */}

              <div className="form-group full-width">

                <label>
                  <FaTasks />
                  {" "}
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter task title..."
                  value={form.title}
                  onChange={handleChange}
                  disabled={loading}
                />

                {errors.title && (
                  <p className="error-text">
                    {errors.title}
                  </p>
                )}

              </div>

              {/* ==========================
                  PROJECT
              ========================== */}

              <div className="form-group">

                <label>
                  <FaFolderOpen />
                  {" "}
                  Project
                </label>

                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="">
                    Select Project
                  </option>

                  {projects.map((project) => (

                    <option
                      key={project._id}
                      value={project._id}
                    >
                      {project.title}
                    </option>

                  ))}

                </select>

                {errors.project && (
                  <p className="error-text">
                    {errors.project}
                  </p>
                )}

              </div>

              {/* ==========================
                  ASSIGNEE
              ========================== */}

              <div className="form-group">

                <label>
                  <FaUser />
                  {" "}
                  Assignee
                </label>

                <select
                  name="assignee"
                  value={form.assignee}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="">
                    Select Team Member
                  </option>

                  {users.map((user) => (

                    <option
                      key={user._id}
                      value={user._id}
                    >
                      {user.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* ==========================
                  STATUS
              ========================== */}

              <div className="form-group">

                <label>
                  <FaChartLine />
                  {" "}
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Review">
                    Review
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>

              {/* ==========================
                  PRIORITY
              ========================== */}

              <div className="form-group">

                <label>
                  <FaFlag />
                  {" "}
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>

                </select>

              </div>

              {/* ==========================
                  DESCRIPTION
              ========================== */}

              <div className="form-group full-width">

                <label>
                  <FaAlignLeft />
                  {" "}
                  Description
                </label>

                <textarea
                  rows={5}
                  name="description"
                  placeholder="Write task description..."
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                />

                {errors.description && (
                  <p className="error-text">
                    {errors.description}
                  </p>
                )}

              </div>
              {/* ==========================
                  PROGRESS
              ========================== */}

              <div className="form-group full-width">

                <label>
                  <FaChartLine />
                  {" "}
                  Progress
                </label>

                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  step="1"
                  value={form.progress}
                  onChange={handleChange}
                  disabled={loading}
                />

                <div className="progress-value">
                  {form.progress}% Completed
                </div>

              </div>

              {/* ==========================
                  ESTIMATED HOURS
              ========================== */}

              <div className="form-group">

                <label>
                  <FaClock />
                  {" "}
                  Estimated Hours
                </label>

                <input
                  type="number"
                  name="estimatedHours"
                  min="0"
                  placeholder="0"
                  value={form.estimatedHours}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* ==========================
                  DUE DATE
              ========================== */}

              <div className="form-group">

                <label>
                  <FaCalendarAlt />
                  {" "}
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* ==========================
                  LABELS
              ========================== */}

              <div className="form-group full-width">

                <label>
                  <FaTags />
                  {" "}
                  Labels
                </label>

                <input
                  type="text"
                  name="labels"
                  placeholder="Frontend, UI, Bug..."
                  value={form.labels}
                  onChange={handleChange}
                  disabled={loading}
                />

                <small className="text-muted">
                  Separate labels with commas.
                </small>

              </div>

            </div>

            {/* ==========================
                MODAL FOOTER
            ========================== */}

            <div className="modal-footer">

              <button
                type="button"
                className="btn-task btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-task btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : task
                  ? "Update Task"
                  : "Create Task"}
              </button>

            </div>
                      </form>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
};

export default TaskModal;