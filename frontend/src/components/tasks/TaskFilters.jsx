import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaTimes,
} from "react-icons/fa";

const TaskFilters = ({
  search,
  setSearch,

  status,
  setStatus,

  priority,
  setPriority,

  sort,
  setSort,

  totalTasks = 0,
  onClearFilters,
}) => {
  return (
    <div className="tasks-toolbar">

      {/* =========================
          LEFT
      ========================= */}

      <div className="toolbar-left">

        {/* Search */}

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

        {/* Status */}

        <select
          className="task-filter"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Pending">
            Pending
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

        {/* Priority */}

        <select
          className="task-filter"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
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
                {/* Sort */}

        <select
          className="task-filter"
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="Newest">
            Newest
          </option>

          <option value="Oldest">
            Oldest
          </option>

          <option value="Priority">
            Priority
          </option>

          <option value="Progress">
            Progress
          </option>

          <option value="A-Z">
            A - Z
          </option>

          <option value="Z-A">
            Z - A
          </option>

        </select>

      </div>

      {/* =========================
          RIGHT
      ========================= */}

      <div className="toolbar-right">

        {/* Task Count */}

        <div className="task-count-chip">

          <FaFilter />

          <span>
            {totalTasks} Task
            {totalTasks !== 1 && "s"}
          </span>

        </div>

        {/* Sort Indicator */}

        <div className="task-count-chip">

          <FaSortAmountDown />

          <span>
            {sort}
          </span>

        </div>

        {/* Clear Filters */}

        <button
          type="button"
          className="btn-task btn-secondary"
          onClick={onClearFilters}
        >
          <FaTimes />

          Clear Filters

        </button>

      </div>

    </div>
  );
};

export default TaskFilters;