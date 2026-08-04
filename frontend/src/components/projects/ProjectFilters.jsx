// src/components/projects/ProjectFilters.jsx

import { motion } from "framer-motion";

import {
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaFlag,
    FaTimes,
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
}) => {

    const clearFilters = () => {

        setSearch("");

        setStatusFilter("All");

        setPriorityFilter("All");

        setSortBy("Newest");

    };
        return (

        <motion.div
            className="project-filters"
            initial={{
                opacity: 0,
                y: 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
            }}
        >

            {/* ===============================
                SEARCH
            ================================ */}

            <div className="filter-search">

                <FaSearch className="filter-icon" />

                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            {/* ===============================
                STATUS
            ================================ */}

            <div className="filter-group">

                <FaFilter className="filter-group-icon" />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
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

            {/* ===============================
                PRIORITY
            ================================ */}

            <div className="filter-group">

                <FaFlag className="filter-group-icon" />

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

            </div>

            {/* ===============================
                SORT
            ================================ */}

            <div className="filter-group">

                <FaSortAmountDown className="filter-group-icon" />

                <select
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(
                            e.target.value
                        )
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

            {/* ===============================
                CLEAR
            ================================ */}

            <motion.button
                type="button"
                className="clear-filters-btn"
                whileHover={{
                    scale: 1.03,
                }}
                whileTap={{
                    scale: 0.96,
                }}
                onClick={clearFilters}
            >

                <FaTimes />

                Clear

            </motion.button>

        </motion.div>
    );
  };

export default ProjectFilters;