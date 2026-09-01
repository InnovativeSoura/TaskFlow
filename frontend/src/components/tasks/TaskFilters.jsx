import { FaSearch, FaFilter, FaSortAmountDown, FaTimes } from "react-icons/fa";

const TaskFilters = ({
  search,
  setSearch,

  statusFilter,
  setStatusFilter,

  priorityFilter,
  setPriorityFilter,

  sortBy,
  setSortBy,

  totalTasks = 0,

  onClearFilters,
}) => {
  return (
    <div className="tasks-toolbar">
      <div className="toolbar-left">
        <div className="toolbar-search">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="task-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>

          <option value="Pending">Pending</option>

          <option value="In Progress">In Progress</option>

          <option value="Review">Review</option>

          <option value="Completed">Completed</option>
        </select>

        <select
          className="task-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>

          <option value="Low">Low</option>

          <option value="Medium">Medium</option>

          <option value="High">High</option>

          <option value="Critical">Critical</option>
        </select>

        <select
          className="task-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Newest">Newest</option>

          <option value="Oldest">Oldest</option>

          <option value="Priority">Priority</option>

          <option value="Due Date">Due Date</option>

          <option value="A-Z">A - Z</option>

          <option value="Z-A">Z - A</option>
        </select>
      </div>

      <div className="toolbar-right">
        <div className="toolbar-chip">
          <FaFilter />

          <span>
            {totalTasks} Task
            {totalTasks !== 1 && "s"}
          </span>
        </div>

        <div className="toolbar-chip">
          <FaSortAmountDown />

          <span>{sortBy}</span>
        </div>

        <button
          className="clear-filter-btn"
          type="button"
          onClick={onClearFilters}
        >
          <FaTimes />

          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
