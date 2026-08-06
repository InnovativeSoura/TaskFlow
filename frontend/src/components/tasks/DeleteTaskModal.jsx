import { motion, AnimatePresence } from "framer-motion";

import {
  FaTrashAlt,
  FaTimes,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaFolderOpen,
  FaFlag,
} from "react-icons/fa";

import "../../styles/DeleteTaskModal.css";

function DeleteTaskModal({
  open,
  task,
  loading = false,
  onClose,
  onConfirm,
}) {
  /* ==========================================================
      ANIMATION
  ========================================================== */

  const backdropVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },

    exit: {
      opacity: 0,
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.92,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,

      transition: {
        duration: 0.28,
      },
    },

    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,

      transition: {
        duration: 0.18,
      },
    },
  };

  if (!open) return null;

  const dueDate = task?.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : null;

  return (
    <AnimatePresence>

      <motion.div
        className="delete-modal-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        {open && (
        <motion.div
          className="delete-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="delete-modal-header">

            <div className="delete-header-left">

              <motion.div
                className="delete-icon"
                initial={{
                  rotate: -15,
                  scale: 0.8,
                }}
                animate={{
                  rotate: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.35,
                }}
              >

                <FaTrashAlt />

              </motion.div>

              <div>

                <h2>Delete Task</h2>

                <p>
                  This action is permanent and cannot be undone.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="delete-close"
              onClick={onClose}
              disabled={loading}
            >

              <FaTimes />

            </button>

          </div>

          {/* ==========================================
              WARNING CARD
          ========================================== */}

          <motion.div
            className="delete-warning"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >

            <FaExclamationTriangle />

            <div>

              <h3>
                Are you sure?
              </h3>

              <p>
                Deleting this task will permanently remove
                all associated information from your workspace.
              </p>

            </div>

          </motion.div>
                    {/* ==========================================
              TASK PREVIEW
          ========================================== */}

          <motion.div
            className="delete-task-preview"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
          >

            <div className="preview-top">

              <div>

                <h3>
                  {task?.title || "Untitled Task"}
                </h3>

                <p>
                  {task?.description?.trim()
                    ? task.description
                    : "No description available for this task."}
                </p>

              </div>

              <span
                className={`priority-badge priority-${(
                  task?.priority || "Medium"
                )
                  .toLowerCase()
                  .replace(/\s/g, "-")}`}
              >
                {task?.priority || "Medium"}
              </span>

            </div>

            {/* ==========================================
                META INFORMATION
            ========================================== */}

            <div className="preview-meta">

              <div className="meta-item">

                <FaFlag />

                <div>

                  <span className="meta-label">
                    Status
                  </span>

                  <strong>
                    {task?.status || "Pending"}
                  </strong>

                </div>

              </div>

              {dueDate && (

                <div className="meta-item">

                  <FaCalendarAlt />

                  <div>

                    <span className="meta-label">
                      Due Date
                    </span>

                    <strong>
                      {dueDate}
                    </strong>

                  </div>

                </div>

              )}

              {task?.project && (

                <div className="meta-item">

                  <FaFolderOpen />

                  <div>

                    <span className="meta-label">
                      Project
                    </span>

                    <strong>
                      {task.project.title ||
                        task.project.name ||
                        "Untitled Project"}
                    </strong>

                  </div>

                </div>

              )}

            </div>

          </motion.div>
                    {/* ==========================================
              FOOTER
          ========================================== */}

          <div className="delete-modal-footer">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="btn-spinner" />
                  Deleting...
                </>

              ) : (

                <>
                  <FaTrashAlt />
                  Delete Task
                </>

              )}

            </button>

          </div>

        </motion.div>

      )};
      </motion.div>
    </AnimatePresence>
  );
}

export default DeleteTaskModal;