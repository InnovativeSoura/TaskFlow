import { useEffect } from "react";
import { FaTrashAlt, FaTimes } from "react-icons/fa";

const DeleteProjectModal = ({
  isOpen,
  onClose,
  onDelete,
  project,
  loading = false,
}) => {

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key === "Escape") {
        onClose();
      }

    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {

    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }

  };

  return (

    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
    >

      <div className="delete-modal">

        <div className="delete-header">

          <div className="delete-icon">

            <FaTrashAlt />

          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >

            <FaTimes />

          </button>

        </div>

        <h2>

          Delete Project

        </h2>

        <p>

          Are you sure you want to delete

          <strong>

            {" "}
            {project?.title || project?.name || "this project"}

          </strong>

          ?

        </p>

        <p className="warning-text">

          This action cannot be undone.

        </p>

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >

            Cancel

          </button>

          <button
            className="delete-btn"
            disabled={loading}
            onClick={() => onDelete(project._id)}
          >

            {loading ? "Deleting..." : "Delete"}

          </button>

        </div>

      </div>

    </div>

  );

};

export default DeleteProjectModal;
