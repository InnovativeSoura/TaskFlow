import { FaFilter, FaRedo } from "react-icons/fa";
import SearchBar from "../SearchBar";

const ProjectFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  sortBy,
  setSortBy,
}) => {
  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setSortBy("Newest");
  };

  return (
    <div className="project-filters">
      {/* Search */}

      <div className="project-search">
        <SearchBar
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search projects..."
        />
      </div>

      {/* Filters */}

      <div className="project-filter-select">
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
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

          <option value="Completed">
            Completed
          </option>

          <option value="Archived">
            Archived
          </option>
        </select>
      </div>

      {/* Sort */}

      <div className="project-filter-select">
        <select
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

          <option value="A-Z">
            A - Z
          </option>

          <option value="Z-A">
            Z - A
          </option>
        </select>
      </div>

      {/* Clear */}

      <button
        type="button"
        className="table-btn view-btn"
        onClick={clearFilters}
      >
        <FaRedo />
        &nbsp; Clear
      </button>
    </div>
  );
};

export default ProjectFilters;
