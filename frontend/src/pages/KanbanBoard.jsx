import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  DragDropContext,
} from "@hello-pangea/dnd";

import KanbanColumn from "../components/KanbanColumn";

import "../styles/kanban.css";

function KanbanBoard() {
  const [tasks, setTasks] =
    useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:5000/api/tasks"
          );

        setTasks(
          res.data.tasks
        );
      } catch (error) {
        console.log(
          error
        );
      }
    };

  const onDragEnd =
    async (result) => {
      if (
        !result.destination
      )
        return;

      const taskId =
        result.draggableId;

      const newStatus =
        result.destination
          .droppableId;

      try {
        await axios.put(
          `http://localhost:5000/api/tasks/status/${taskId}`,
          {
            status:
              newStatus,
          }
        );

        fetchTasks();
      } catch (error) {
        console.log(
          error
        );
      }
    };

  const todo =
    tasks.filter(
      (task) =>
        task.status ===
        "Todo"
    );

  const inProgress =
    tasks.filter(
      (task) =>
        task.status ===
        "In Progress"
    );

  const review =
    tasks.filter(
      (task) =>
        task.status ===
        "Review"
    );

  const completed =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    );

  return (
    <div className="kanban-page">
      <h1>
        Project Board
      </h1>

      <DragDropContext
        onDragEnd={
          onDragEnd
        }
      >
        <div className="kanban-grid">
          <KanbanColumn
            title="Todo"
            tasks={todo}
          />

          <KanbanColumn
            title="In Progress"
            tasks={
              inProgress
            }
          />

          <KanbanColumn
            title="Review"
            tasks={review}
          />

          <KanbanColumn
            title="Completed"
            tasks={
              completed
            }
          />
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;