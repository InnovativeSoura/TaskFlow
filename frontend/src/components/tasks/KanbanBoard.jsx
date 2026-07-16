import { useMemo } from "react";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
} from "@dnd-kit/sortable";

import KanbanColumn from "./KanbanColumn";


const KanbanBoard = ({
  tasks = [],
  onUpdateStatus,
  onEdit,
  onDelete,
  canManage = true,
}) => {


  /* ==========================================
      COLUMNS
  ========================================== */

  const columns = [
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



  /* ==========================================
      GROUP TASKS
  ========================================== */

  const groupedTasks = useMemo(() => {

    const result = {};

    columns.forEach((column) => {
      result[column.id] = [];
    });


    tasks.forEach((task) => {

      const status =
        task.status || "Pending";


      if (result[status]) {

        result[status].push(task);

      } else {

        result.Pending.push(task);

      }

    });


    return result;


  }, [tasks]);




  /* ==========================================
      DRAG END
  ========================================== */

  const handleDragEnd = ({
    active,
    over,
  }) => {


    if (!over) return;


    const taskId = active.id;


    let newStatus =
      over.id;



    /*
      Compatibility with
      old backend statuses
    */

    if (
      newStatus === "Todo"
    ) {

      newStatus =
        "Pending";

    }



    const task =
      tasks.find(
        (item) =>
          item._id === taskId
      );



    if (!task) return;



    if (
      task.status === newStatus
    ) {
      return;
    }



    onUpdateStatus(
      taskId,
      newStatus
    );

  };





  return (

    <div className="kanban-wrapper">


      <DndContext
        collisionDetection={
          closestCenter
        }
        onDragEnd={
          handleDragEnd
        }
      >


        <div className="kanban-board">


          {columns.map(
            (column) => (

              <KanbanColumn

                key={
                  column.id
                }

                id={
                  column.id
                }

                title={
                  column.title
                }

                tasks={
                  groupedTasks[
                    column.id
                  ]
                }

                canManage={
                  canManage
                }

                onEdit={
                  onEdit
                }

                onDelete={
                  onDelete
                }

              />

            )
          )}


        </div>


      </DndContext>


    </div>

  );

};


export default KanbanBoard;