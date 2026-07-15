import { useEffect } from "react";
import {
  FaTrashAlt,
  FaTimes,
} from "react-icons/fa";

const DeleteProjectModal = ({
  open,
  onClose,
  onConfirm,
  project,
  loading = false,
}) => {
  /* ==========================================
     ESC TO CLOSE
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

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [open, loading, onClose]);

  if (!open) return null;

  /* ==========================================
     CLICK OUTSIDE
  ========================================== */

  const handleOverlayClick = (e) => {
    if (
      e.target.classList.contains(
        "modal-overlay"
      ) &&
      !loading
    ) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="modal delete-modal">
        {/* Header */}

        <div className="delete-header">
          <div className="delete-icon">
            <FaTrashAlt />
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Title */}

        <h2>Delete Project</h2>

        {/* Message */}

        <p>
          Are you sure you want to delete
          <br />

          <strong>
            {project?.title ||
              "this project"}
          </strong>
          ?
        </p>

        <p className="warning-text">
          This action cannot be undone.
        </p>

        {/* Actions */}

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={onConfirm}
            disabled={loading}
          >
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

