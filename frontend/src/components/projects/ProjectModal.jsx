import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  status: "Planning",
  priority: "Medium",
  progress: 0,
  category: "",
  dueDate: "",
  manager: "",
};

const ProjectModal = ({
  open,
  project,
  onSave,
  onClose,
}) => {
  /* ==========================================
     STATE
  ========================================== */

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  /* ==========================================
     LOAD PROJECT
  ========================================== */

  useEffect(() => {
    if (!open) return;

    if (project) {
      setForm({
        title: project.title || "",
        description:
          project.description || "",
        status:
          project.status || "Planning",
        priority:
          project.priority || "Medium",
        progress:
          project.progress ?? 0,
        category:
          project.category || "",
        dueDate: project.dueDate
          ? project.dueDate.substring(0, 10)
          : "",
        manager:
          project.manager || "",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [project, open]);

  /* ==========================================
     INPUT CHANGE
  ========================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "range"
          ? Number(value)
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* ==========================================
     VALIDATION
  ========================================== */

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title =
        "Project title is required.";
    } else if (
      form.title.length > 100
    ) {
      newErrors.title =
        "Maximum 100 characters.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required.";
    } else if (
      form.description.length > 500
    ) {
      newErrors.description =
        "Maximum 500 characters.";
    }

    if (
      form.progress < 0 ||
      form.progress > 100
    ) {
      newErrors.progress =
        "Progress must be between 0 and 100.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  /* ==========================================
     SUBMIT
  ========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await onSave({
        ...form,
        progress: Number(
          form.progress
        ),
      });

      setForm(initialForm);
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {project
            ? "Edit Project"
            : "Create Project"}
        </h2>

        <form
          onSubmit={handleSubmit}
        >


          {/* ==========================================
              TITLE
          ========================================== */}

          <div>
            <label>Project Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter project title"
              maxLength={100}
            />

            {errors.title && (
              <small className="error">
                {errors.title}
              </small>
            )}
          </div>

          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          <div>
            <label>Description</label>

            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the project..."
              maxLength={500}
            />

            {errors.description && (
              <small className="error">
                {errors.description}
              </small>
            )}
          </div>

          {/* ==========================================
              STATUS
          ========================================== */}

          <div>
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Planning">
                Planning
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Archived">
                Archived
              </option>
            </select>
          </div>

          {/* ==========================================
              PRIORITY
          ========================================== */}

          <div>
            <label>Priority</label>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
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

          {/* ==========================================
              PROGRESS
          ========================================== */}

          <div>
            <label>
              Progress ({form.progress}%)
            </label>

            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              step="1"
              value={form.progress}
              onChange={handleChange}
            />

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${form.progress}%`,
                }}
              />
            </div>

            {errors.progress && (
              <small className="error">
                {errors.progress}
              </small>
            )}
          </div>

          {/* ==========================================
              CATEGORY
          ========================================== */}

          <div>
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Web App, Mobile App, AI, CRM..."
            />
          </div>

          {/* ==========================================
              DUE DATE
          ========================================== */}

          <div>
            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          {/* ==========================================
              PROJECT MANAGER
          ========================================== */}

          <div>
            <label>Project Manager</label>

            <input
              type="text"
              name="manager"
              value={form.manager}
              onChange={handleChange}
              placeholder="Manager name"
            />
          </div>

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setErrors({});
                onClose();
              }}
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
                : project
                ? "Update Project"
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

