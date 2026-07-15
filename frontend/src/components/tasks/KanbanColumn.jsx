import { motion, AnimatePresence } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  FaClipboardList,
  FaSpinner,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";

import TaskCard from "./TaskCard";

const columnIcons = {
  Todo: <FaClipboardList />,
  "In Progress": <FaSpinner />,
  Review: <FaSearch />,
  Completed: <FaCheckCircle />,
};

function KanbanColumn({
  id,
  title,
  tasks = [],
  canManage = true,
  onEdit,
  onDelete,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      ref={setNodeRef}
      className={`kanban-column ${
        isOver ? "drag-over" : ""
      }`}
    >
      {/* Header */}

      <div className="column-header">
        <div className="column-title">
          {columnIcons[title]}

          <span>{title}</span>
        </div>

        <div className="column-count">
          {tasks.length}
        </div>
      </div>

      {/* Task List */}

      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="column-body">

          <AnimatePresence>

            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  canManage={canManage}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <motion.div
                className="tasks-empty"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <FaClipboardList />

                <h4>No Tasks</h4>

                <p>
                  Drag a task here or create a new one.
                </p>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </SortableContext>
    </motion.div>
  );
}

export default KanbanColumn;