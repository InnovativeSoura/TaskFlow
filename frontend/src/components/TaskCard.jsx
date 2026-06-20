function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>

      <p>{task.description}</p>

      <div className="task-footer">
        <span>{task.priority}</span>

        <span>
          {task.assignedTo?.name ||
            "Unassigned"}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;