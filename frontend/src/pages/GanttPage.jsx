import {
  Gantt,
} from "gantt-task-react";

import "gantt-task-react/dist/index.css";

function GanttPage() {
  const tasks = [
    {
      start: new Date(),
      end: new Date(
        Date.now() +
          86400000 * 5
      ),
      name:
        "API Development",
      id: "1",
      progress: 60,
      type: "task",
    },
  ];

  return (
    <Gantt
      tasks={tasks}
    />
  );
}

export default GanttPage;