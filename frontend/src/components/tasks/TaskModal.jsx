import { useEffect, useState } from "react";

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
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        project:
          task.project?._id ||
          task.project ||
          "",
        assignee:
          task.assignee?._id ||
          task.assignee ||
          "",
        status: task.status || "Pending",
        priority: task.priority || "Medium",
        progress: task.progress || 0,
        estimatedHours:
          task.estimatedHours || "",
        labels: Array.isArray(task.labels)
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
    const { name, value } = e.target;

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

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await onSave({
        ...form,
        progress: Number(form.progress),
        estimatedHours:
          form.estimatedHours === ""
            ? null
            : Number(form.estimatedHours),
        labels: form.labels
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>
          {task
            ? "Edit Task"
            : "Create Task"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div>
            <label>Task Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
            />

            {errors.title && (
              <small className="error">
                {errors.title}
              </small>
            )}
          </div>

          <div>
            <label>Description</label>

            <textarea
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={loading}
            />

            {errors.description && (
              <small className="error">
                {errors.description}
              </small>
            )}
          </div>

          <div>
            <label>Project</label>

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
              <small className="error">
                {errors.project}
              </small>
            )}
          </div>

          <div>
            <label>Assign To</label>

            <select
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">
                Select User
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

          <div>
            <label>Status</label>

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

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          <div>
            <label>Priority</label>

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
            </select>
          </div>

          <div>
            <label>Progress (%)</label>

            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={form.progress}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label>Estimated Hours</label>

            <input
              type="number"
              name="estimatedHours"
              min="0"
              value={form.estimatedHours}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label>Labels</label>

            <input
              type="text"
              name="labels"
              placeholder="Frontend, UI, Bug"
              value={form.labels}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="modal-actions">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
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

      </div>
    </div>
  );
};

export default TaskModal;