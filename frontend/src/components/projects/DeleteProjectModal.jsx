import { useEffect } from "react";

import {
  FaTrashAlt,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

const DeleteProjectModal = ({
  open,
  project,
  loading = false,
  onClose,
  onConfirm,
}) => {
  /* ==========================================
      ESC KEY SUPPORT
  ========================================== */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "auto";
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===========================
            HEADER
        =========================== */}

        <div className="delete-header">
          <div className="delete-icon">
            <FaExclamationTriangle />
          </div>

          <h2>Delete Project</h2>

          <button
            className="close-btn"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* ===========================
            BODY
        =========================== */}

        <div className="delete-body">
          <p>
            Are you sure you want to permanently
            delete this project?
          </p>

          <h3>
            {project?.title || "Untitled Project"}
          </h3>

          <p className="delete-warning">
            This action cannot be undone.
            All project information,
            tasks, members and progress
            history may be permanently lost.
          </p>
        </div>

        {/* ===========================
            ACTIONS
        =========================== */}

        <div className="delete-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            <FaTrashAlt />

            {loading
              ? "Deleting..."
              : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;