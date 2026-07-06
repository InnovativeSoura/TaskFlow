import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  status: "Planning",
  priority: "Medium",
  dueDate: "",
  manager: "",
};

const ProjectModal = ({
  open,
  project,
  onSave,
  onClose,
}) => {

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {

    if (project) {

      setForm({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "Planning",
        priority: project.priority || "Medium",
        dueDate: project.dueDate
          ? project.dueDate.substring(0, 10)
          : "",
        manager: project.manager || "",
      });

    } else {

      setForm(initialForm);

    }

    setErrors({});

  }, [project, open]);

  if (!open) return null;

  /* ===========================
      INPUT CHANGE
  =========================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  /* ===========================
      VALIDATION
  =========================== */

  const validate = () => {

    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Project title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  /* ===========================
      SUBMIT
  =========================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      setLoading(true);

      await onSave(form);

      setForm(initialForm);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>

          {project
            ? "Edit Project"
            : "Create Project"}

        </h2>

        <form onSubmit={handleSubmit}>

          {/* Title */}

          <div>

            <label>Project Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter project title"
            />

            {errors.title && (
              <small className="error">
                {errors.title}
              </small>
            )}

          </div>

          {/* Description */}

          <div>

            <label>Description</label>

            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the project..."
            />

            {errors.description && (
              <small className="error">
                {errors.description}
              </small>
            )}

          </div>

          {/* Status */}

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

          {/* Priority */}

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

          {/* Due Date */}

          <div>

            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />

          </div>

          {/* Manager */}

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

          {/* Buttons */}

          <div className="modal-actions">

            <button
              type="button"
              onClick={onClose}
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