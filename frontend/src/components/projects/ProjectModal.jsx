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

const defaultProject = {
  title: "",
  description: "",
  status: "Planning",
  priority: "Medium",
  progress: 0,
  startDate: "",
  endDate: "",
  color: "#6366f1",
  members: [],
};

const ProjectModal = ({
  open,
  project,
  loading = false,
  users = [],
  onClose,
  onSave,
}) => {
  const [formData, setFormData] =
    useState(defaultProject);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description:
          project.description || "",
        status:
          project.status ||
          "Planning",
        priority:
          project.priority ||
          "Medium",
        progress:
          project.progress || 0,
        startDate:
          project.startDate
            ?.substring(0, 10) || "",
        endDate:
          project.endDate
            ?.substring(0, 10) || "",
        color:
          project.color ||
          "#6366f1",
        members:
          project.members?.map(
            (m) =>
              m._id || m
          ) || [],
      });
    } else {
      setFormData(defaultProject);
    }
  }, [project, open]);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMember = (id) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter(
            (m) => m !== id
          )
        : [
            ...prev.members,
            id,
          ],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim())
      return;

    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="project-modal">

        <button
          className="modal-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="modal-header">

          <h2>

            <FaFolderOpen />

            {project
              ? " Edit Project"
              : " Create Project"}

          </h2>

          <p>
            Manage your project
            information.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="project-form"
        >
                  {/* ===========================
              TITLE
          =========================== */}

          <div className="form-group">

            <label>

              <FaFolderOpen />

              Project Title

            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>

          {/* ===========================
              DESCRIPTION
          =========================== */}

          <div className="form-group">

            <label>

              <FaAlignLeft />

              Description

            </label>

            <textarea
              rows="4"
              name="description"
              placeholder="Write project description..."
              value={formData.description}
              onChange={handleChange}
            />

          </div>

          {/* ===========================
              STATUS & PRIORITY
          =========================== */}

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

                <option value="Planning">
                  Planning
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="On Hold">
                  On Hold
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Archived">
                  Archived
                </option>

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

          </div>
                    {/* ===========================
              PROGRESS
          =========================== */}

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

          {/* ===========================
              START & END DATE
          =========================== */}

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

          {/* ===========================
              PROJECT COLOR
          =========================== */}

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

              <span className="color-value">
                {formData.color}
              </span>

            </div>

          </div>
                    {/* ===========================
              TEAM MEMBERS
          =========================== */}

          <div className="form-group">

            <label>
              Team Members
            </label>

            <div className="members-list">

              {users.length === 0 ? (

                <div className="empty-members">
                  No users available
                </div>

              ) : (

                users.map((user) => (

                  <label
                    key={user._id}
                    className="member-item"
                  >

                    <input
                      type="checkbox"
                      checked={formData.members.includes(
                        user._id
                      )}
                      onChange={() =>
                        toggleMember(
                          user._id
                        )
                      }
                    />

                    <div className="member-avatar">

                      {user.avatar ? (

                        <img
                          src={user.avatar}
                          alt={user.name}
                        />

                      ) : (

                        <span>
                          {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </span>

                      )}

                    </div>

                    <div className="member-details">

                      <strong>
                        {user.name}
                      </strong>

                      <small>
                        {user.email}
                      </small>

                    </div>

                  </label>

                ))

              )}

            </div>

          </div>
                    {/* ===========================
              ACTIONS
          =========================== */}

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

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <FaSave />

              {loading
                ? project
                  ? "Updating..."
                  : "Creating..."
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