import { motion, AnimatePresence } from "framer-motion";

import {
  FaTrashAlt,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

const DeleteTaskModal = ({
  open,
  task,
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!open || !task) return null;

  return (
    <AnimatePresence>

      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <motion.div
          className="modal-content delete-modal"
          initial={{
            scale: 0.9,
            opacity: 0,
            y: 30,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
            y: 20,
          }}
          transition={{
            duration: 0.25,
          }}
        >

          {/* Header */}

          <div className="modal-header">

            <h2 className="modal-title">
              Delete Task
            </h2>

            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              disabled={loading}
            >
              <FaTimes />
            </button>

          </div>

          {/* Body */}

          <div className="delete-body">

            <div className="delete-icon">
              <FaTrashAlt />
            </div>

            <h3
              style={{
                marginTop: "20px",
              }}
            >
              Delete this task?
            </h3>

            <p
              className="text-muted"
              style={{
                marginTop: "12px",
              }}
            >
              This action cannot be undone.
              The task and its related
              information will be removed
              permanently.
            </p>

            <div className="task-delete-preview">

              <FaExclamationTriangle />

              <span>
                {task.title}
              </span>

            </div>

            <p className="warning-text">
              Once deleted, this task
              cannot be recovered.
            </p>
                        {/* Footer */}

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
                type="button"
                className="btn-task btn-danger"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  "Deleting..."
                ) : (
                  <>
                    <FaTrashAlt />
                    {" "}
                    Delete Task
                  </>
                )}
              </button>

            </div>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
};

export default DeleteTaskModal;