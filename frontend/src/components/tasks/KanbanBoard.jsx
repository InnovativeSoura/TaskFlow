import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

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

import KanbanColumn from "./KanbanColumn";

const COLUMNS = [
  {
    id: "Pending",
    title: "Pending",
    color: "#6366f1",
    icon: <FaClipboardList />,
  },
  {
    id: "In Progress",
    title: "In Progress",
    color: "#f59e0b",
    icon: <FaSpinner />,
  },
  {
    id: "Review",
    title: "Review",
    color: "#06b6d4",
    icon: <FaSearch />,
  },
  {
    id: "Completed",
    title: "Completed",
    color: "#10b981",
    icon: <FaCheckCircle />,
  },
];

export default function KanbanBoard({
  tasks = [],
  onStatusChange,
  onEdit,
  onDelete,
}) {

  const sensors = useSensors(
    useSensor(PointerSensor,{
      activationConstraint:{
        distance:6,
      },
    })
  );

  const groupedTasks = useMemo(() => {

    const groups = {
      Pending:[],
      "In Progress":[],
      Review:[],
      Completed:[],
    };

    tasks.forEach(task=>{

      let status = task.status || "Pending";

      if(status==="Todo" || status==="To Do"){
        status="Pending";
      }

      if(!groups[status]){
        status="Pending";
      }

      groups[status].push(task);

    });

    return groups;

  },[tasks]);

  const handleDragEnd = ({active,over})=>{

    if(!over) return;

    const dragged = tasks.find(
      t=>t._id===active.id
    );

    if(!dragged) return;

    let newStatus = over.id;

    const overTask = tasks.find(
      t=>t._id===over.id
    );

    if(overTask){
      newStatus = overTask.status;
    }

    if(newStatus==="Todo"){
      newStatus="Pending";
    }

    if(dragged.status===newStatus){
      return;
    }

    onStatusChange(dragged._id,newStatus);

  };

  return (

    <motion.section
      className="kanban-wrapper"
      initial={{opacity:0,y:25}}
      animate={{opacity:1,y:0}}
      transition={{duration:.35}}
    >

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >

        <SortableContext
          items={tasks.map(t=>t._id)}
          strategy={verticalListSortingStrategy}
        >

          <div className="kanban-board">

            {COLUMNS.map(column=>(

              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                icon={column.icon}
                tasks={groupedTasks[column.id]}
                onEdit={onEdit}
                onDelete={onDelete}
              />

            ))}

          </div>

        </SortableContext>

      </DndContext>

      <motion.div
        className="kanban-summary"
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:.25}}
      >

        {COLUMNS.map(column=>{

          const count = groupedTasks[column.id].length;

          const percent =
            tasks.length===0
              ?0
              :Math.round(
                  (count/tasks.length)*100
                );

          return(

            <motion.div
              whileHover={{
                y:-5,
              }}
              key={column.id}
              className="summary-card"
            >

              <div
                className="summary-icon"
                style={{
                  background:column.color,
                }}
              >
                {column.icon}
              </div>

              <div className="summary-content">

                <h4>{column.title}</h4>

                <h2>{count}</h2>

                <span>{percent}% of tasks</span>

              </div>

            </motion.div>

          );

        })}

      </motion.div>

    </motion.section>

  );

}