import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

const ProjectFilters = ({
  search,
  setSearch,

  statusFilter,
  setStatusFilter,

  priorityFilter,
  setPriorityFilter,

  sortBy,
  setSortBy,

  totalProjects = 0,
}) => {
  return (
    <div className="project-toolbar">

      {/* SEARCH */}
      <div className="toolbar-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* STATUS FILTER */}
      <div className="toolbar-select">

        <FaFilter />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Planning">
            Planning
          </option>

          <option value="Active">
            Active
          </option>

          <option value="On Hold">
            On Hold
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Archived">
            Archived
          </option>

        </select>

      </div>


      {/* PRIORITY FILTER */}
      <div className="toolbar-select">

        <FaFilter />

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Priority
          </option>

          <option value="Critical">
            Critical
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>

        </select>

      </div>


      {/* SORT */}
      <div className="toolbar-select">

        <FaSortAmountDown />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >

          <option value="Newest">
            Newest
          </option>

          <option value="Oldest">
            Oldest
          </option>

          <option value="A-Z">
            A - Z
          </option>

          <option value="Z-A">
            Z - A
          </option>

          <option value="Priority">
            Priority
          </option>

          <option value="Progress">
            Progress
          </option>

        </select>

      </div>


      {/* COUNT */}
      <div className="toolbar-count">

        <span>
          Total Projects
        </span>

        <strong>
          {totalProjects}
        </strong>

      </div>


    </div>
  );
};


export default ProjectFilters;