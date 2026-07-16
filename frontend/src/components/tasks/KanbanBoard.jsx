import { useMemo } from "react";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import KanbanColumn from "./KanbanColumn";

const COLUMNS = [
  {
    id: "Pending",
    title: "Pending",
  },
  {
    id: "In Progress",
    title: "In Progress",
  },
  {
    id: "Review",
    title: "Review",
  },
  {
    id: "Completed",
    title: "Completed",
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
      let status = task.status || "Pending";

      // Compatibility with old backend values
      if (status === "Todo") {
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

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const draggedTask = tasks.find(
      (task) => task._id === active.id
    );

    if (!draggedTask) return;

    let destinationStatus = over.id;

    // If dropped on another task,
    // use that task's column
    const targetTask = tasks.find(
      (task) => task._id === over.id
    );

    if (targetTask) {
      destinationStatus = targetTask.status;
    }

    if (destinationStatus === "Todo") {
      destinationStatus = "Pending";
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
    <div className="kanban-wrapper">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
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
      </DndContext>
    </div>
  );
};

export default KanbanBoard;