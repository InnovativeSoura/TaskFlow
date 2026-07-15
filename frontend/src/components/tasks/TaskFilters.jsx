import { motion } from "framer-motion";

import {
  FaFilter,
  FaSearch,
  FaUndo,
  FaTasks,
} from "react-icons/fa";

function TaskFilters({
  search,
  setSearch,

  statusFilter,
  setStatusFilter,

  priorityFilter,
  setPriorityFilter,

  sortBy,
  setSortBy,

  totalTasks = 0,
}) {
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setSortBy("Newest");
  };

  return (
    <motion.div
      className="tasks-toolbar"
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      {/* Left */}

      <div className="toolbar-left">

        <div className="toolbar-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="task-count-chip">

          <FaTasks />

          <span>
            {totalTasks} Tasks
          </span>

        </div>

      </div>

      {/* Right */}

      <div className="toolbar-right">

        <select
          className="task-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Todo">
            Todo
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Review">
            Review
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

        <select
          className="task-filter"
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option value="All">
            All Priority
          </option>

          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>

          <option value="Critical">
            Critical
          </option>
        </select>

        <select
          className="task-filter"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="Newest">
            Newest First
          </option>

          <option value="Oldest">
            Oldest First
          </option>

          <option value="Priority">
            Priority
          </option>

          <option value="Due Date">
            Due Date
          </option>

          <option value="A-Z">
            A → Z
          </option>

          <option value="Z-A">
            Z → A
          </option>
        </select>

        <button
          className="btn-task btn-secondary"
          onClick={resetFilters}
        >
          <FaUndo />

          Reset
        </button>

      </div>
    </motion.div>
  );
}

export default TaskFilters;