import { useEffect, useState } from "react";

import {
  FaTimes,
  FaSave,
  FaFolderOpen,
  FaAlignLeft,
  FaFlag,
  FaTasks,
  FaCalendarAlt,
  FaPalette,
} from "react-icons/fa";

const createDefaultProject = () => ({
  title: "",
  description: "",
  status: "Planning",
  priority: "Medium",
  progress: 0,
  startDate: "",
  endDate: "",
  color: "#6366f1",
  members: [],
});

const ProjectModal = ({
  open,
  project,
  loading = false,
  users = [],
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(createDefaultProject());

  useEffect(() => {
    if (!open) return;

    if (project) {
      setFormData({
        title: project.title || "",

        description: project.description || "",

        status: project.status || "Planning",

        priority: project.priority || "Medium",

        progress: Number(project.progress) || 0,

        startDate: project.startDate?.substring(0, 10) || "",

        endDate: project.endDate?.substring(0, 10) || "",

        color: project.color || "#6366f1",

        members: project.members?.map((member) => member._id || member) || [],
      });
    } else {
      setFormData(createDefaultProject());
    }
  }, [project, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const toggleMember = (id) => {
    setFormData((prev) => ({
      ...prev,

      members: prev.members.includes(id)
        ? prev.members.filter((member) => member !== id)
        : [...prev.members, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      alert("End date cannot be before start date.");

      return;
    }

    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="project-modal">
        <button className="modal-close" type="button" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <h2>
            <FaFolderOpen />

            {project ? " Edit Project" : " Create Project"}
          </h2>

          <p>Manage your project information.</p>
        </div>

        <form className="project-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaFolderOpen />
              Project Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Enter project title"
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
              rows="4"
              value={formData.description}
              placeholder="Write project description..."
              onChange={handleChange}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <FaTasks />
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Planning</option>

                <option>Active</option>

                <option>On Hold</option>

                <option>Completed</option>

                <option>Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaFlag />
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>

                <option>Medium</option>

                <option>High</option>

                <option>Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaTasks />
              Progress ({formData.progress}%)
            </label>

            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <FaCalendarAlt />
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <FaCalendarAlt />
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaPalette />
              Theme Color
            </label>

            <div className="color-picker-wrapper">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />

              <span className="color-value">{formData.color}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Team Members</label>

            <div className="members-list">
              {users.length === 0 ? (
                <div className="empty-members">No users available</div>
              ) : (
                users.map((user) => (
                  <div key={user._id} className="member-item">
                    <input
                      type="checkbox"
                      checked={formData.members.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                    />

                    <div className="member-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="member-details">
                      <strong>{user.name}</strong>

                      <small>{user.email}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              <FaTimes />
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              <FaSave />

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
