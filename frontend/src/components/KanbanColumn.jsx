import {
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import TaskCard from "./TaskCard";

function KanbanColumn({
  title,
  tasks,
}) {
  return (
    <div className="kanban-column">
      <h3>{title}</h3>

      <Droppable
        droppableId={title}
      >
        {(provided) => (
          <div
            ref={
              provided.innerRef
            }
            {...provided.droppableProps}
            className="column-body"
          >
            {tasks.map(
              (
                task,
                index
              ) => (
                <Draggable
                  key={task._id}
                  draggableId={
                    task._id
                  }
                  index={index}
                >
                  {(
                    provided
                  ) => (
                    <div
                      ref={
                        provided.innerRef
                      }
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard
                        task={
                          task
                        }
                      />
                    </div>
                  )}
                </Draggable>
              )
            )}

            {
              provided.placeholder
            }
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;