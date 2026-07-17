import { useMemo } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { motion } from "framer-motion";

import KanbanColumn from "./KanbanColumn";

/* ==========================================
   KANBAN COLUMNS
========================================== */

const COLUMNS = [
  {
    id: "Pending",
    title: "Pending",
    color: "#6366f1",
  },
  {
    id: "In Progress",
    title: "In Progress",
    color: "#f59e0b",
  },
  {
    id: "Review",
    title: "Review",
    color: "#06b6d4",
  },
  {
    id: "Completed",
    title: "Completed",
    color: "#10b981",
  },
];

const KanbanBoard = ({
  tasks = [],
  onUpdateStatus,
  onEdit,
  onDelete,
  canManage = true,
}) => {
  /* ==========================================
      DND SENSORS
  ========================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  /* ==========================================
      GROUP TASKS
  ========================================== */

  const groupedTasks = useMemo(() => {
    const groups = {
      Pending: [],
      "In Progress": [],
      Review: [],
      Completed: [],
    };

    tasks.forEach((task) => {
      let status =
        task.status || "Pending";

      if (
        status === "Todo" ||
        status === "To Do"
      ) {
        status = "Pending";
      }

      if (!groups[status]) {
        status = "Pending";
      }

      groups[status].push(task);
    });

    return groups;
  }, [tasks]);

  /* ==========================================
      DRAG END
  ========================================== */

  const handleDragEnd = ({
    active,
    over,
  }) => {
    if (!over) return;

    const draggedTask =
      tasks.find(
        (task) =>
          task._id === active.id
      );

    if (!draggedTask) return;

    let destinationStatus =
      over.id;

    const targetTask =
      tasks.find(
        (task) =>
          task._id === over.id
      );

    if (targetTask) {
      destinationStatus =
        targetTask.status;
    }

    if (
      destinationStatus === "Todo" ||
      destinationStatus === "To Do"
    ) {
      destinationStatus =
        "Pending";
    }

    if (
      draggedTask.status ===
      destinationStatus
    ) {
      return;
    }

    onUpdateStatus(
      draggedTask._id,
      destinationStatus
    );
  };

  return (
    <motion.div
      className="kanban-wrapper"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={
          closestCenter
        }
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map(
            (task) => task._id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >
          <div className="kanban-board">
                      {COLUMNS.map((column) => (

              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={
                  groupedTasks[column.id] || []
                }
                canManage={canManage}
                onEdit={onEdit}
                onDelete={onDelete}
              />

            ))}
          </div>

        </SortableContext>

      </DndContext>

      {/* ==========================================
          BOARD SUMMARY
      ========================================== */}

      <motion.div
        className="task-stats-grid"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
      >

        {COLUMNS.map((column) => (

          <div
            key={column.id}
            className="task-stat-card"
          >

            <div className="task-stat-title">
              {column.title}
            </div>

            <div
              className="task-stat-value"
              style={{
                color: column.color,
              }}
            >
              {
                groupedTasks[column.id]
                  ?.length || 0
              }
            </div>

            <div className="task-stat-change">
              {tasks.length > 0
                ? `${Math.round(
                    ((groupedTasks[column.id]
                      ?.length || 0) /
                      tasks.length) *
                      100
                  )}% of tasks`
                : "No tasks"}
            </div>

          </div>

        ))}

      </motion.div>

    </motion.div>
  );
};

export default KanbanBoard;