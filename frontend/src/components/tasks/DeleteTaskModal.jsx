import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaTrashAlt,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

function DeleteTaskModal({
  open,
  task,
  loading = false,
  onClose,
  onConfirm,
}) {
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

  const handleOverlayClick = (e) => {
    if (
      loading ||
      e.target !== e.currentTarget
    )
      return;

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-content delete-modal"
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
          }}
          transition={{
            duration: 0.25,
          }}
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          {/* Header */}

          <div className="modal-header">

            <div className="delete-icon">
              <FaExclamationTriangle />
            </div>

            <button
              className="modal-close"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              <FaTimes />
            </button>

          </div>

          {/* Body */}

          <div className="delete-body">

            <h2 className="modal-title">
              Delete Task
            </h2>

            <p>
              You're about to permanently
              delete
            </p>

            <div className="task-delete-preview">
              <FaTrashAlt />

              <span>
                {task?.title ??
                  "Untitled Task"}
              </span>
            </div>

            <p className="warning-text">
              This action cannot be undone.
            </p>

          </div>

          {/* Footer */}

          <div className="modal-footer">

            <button
              type="button"
              className="btn-task btn-secondary"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-task btn-danger"
              disabled={loading}
              onClick={onConfirm}
            >
              {loading
                ? "Deleting..."
                : "Delete Task"}
            </button>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeleteTaskModal;