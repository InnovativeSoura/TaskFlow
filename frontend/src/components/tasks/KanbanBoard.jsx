import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import KanbanColumn from "./KanbanColumn";

const COLUMNS = [
  {
    id: "Todo",
    title: "Todo",
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

function KanbanBoard({
  tasks = [],
  canManage = true,
  onEdit,
  onDelete,
  onTaskMove,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groupedTasks = useMemo(() => {
    return {
      Todo: tasks.filter(
        (task) =>
          (task.status || "Todo") === "Todo"
      ),

      "In Progress": tasks.filter(
        (task) =>
          task.status === "In Progress"
      ),

      Review: tasks.filter(
        (task) =>
          task.status === "Review"
      ),

      Completed: tasks.filter(
        (task) =>
          task.status === "Completed"
      ),
    };
  }, [tasks]);

  const findTask = (id) =>
    tasks.find((task) => task._id === id);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeTask = findTask(active.id);

    if (!activeTask) return;

    let newStatus = over.id;

    if (
      !COLUMNS.some(
        (column) => column.id === over.id
      )
    ) {
      const targetTask = findTask(over.id);

      if (!targetTask) return;

      newStatus = targetTask.status;
    }

    if (
      newStatus &&
      newStatus !== activeTask.status
    ) {
      onTaskMove?.(
        activeTask,
        newStatus
      );
    }
  };

  return (
    <motion.div
      className="kanban-board"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.35,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
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
      </DndContext>
    </motion.div>
  );
}

export default KanbanBoard;