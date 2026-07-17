import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import MainLayout from "../layouts/MainLayout";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectTable from "../components/projects/ProjectTable";
import ProjectModal from "../components/projects/ProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";
import StatCard from "../components/StatCard";

import useProjects from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";

import "../styles/Projects.css";

const Projects = () => {
  const { user } = useAuth();

  const {
    projects = [],
    loading,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  /* ==========================================
      FILTERS
  ========================================== */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  /* ==========================================
      PAGINATION
  ========================================== */

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /* ==========================================
      MODALS
  ========================================== */

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const canManage =
    user?.role === "Admin" ||
    user?.role === "Manager";

  /* ==========================================
      FILTER + SORT
  ========================================== */

  const filteredProjects = useMemo(() => {
    let data = [...projects];

    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter(
        (project) =>
          project.title
            ?.toLowerCase()
            .includes(query) ||
          project.description
            ?.toLowerCase()
            .includes(query)
      );
    }

    if (statusFilter !== "All") {
      data = data.filter(
        (project) =>
          project.status === statusFilter
      );
    }

    if (priorityFilter !== "All") {
      data = data.filter(
        (project) =>
          project.priority === priorityFilter
      );
    }

    switch (sortBy) {
      case "A-Z":
        data.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case "Z-A":
        data.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;

      case "Oldest":
        data.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "Priority": {
        const priorityOrder = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        data.sort(
          (a, b) =>
            (priorityOrder[b.priority] || 0) -
            (priorityOrder[a.priority] || 0)
        );

        break;
      }

      case "Progress":
        data.sort(
          (a, b) =>
            (b.progress || 0) -
            (a.progress || 0)
        );
        break;

      default:
        data.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
    }

    return data;
  }, [
    projects,
    search,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);

  /* ==========================================
      PAGINATION
  ========================================== */

  const totalPages = Math.ceil(
    filteredProjects.length / itemsPerPage
  );

  const paginatedProjects =
    filteredProjects.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);

  /* ==========================================
      DASHBOARD STATS
  ========================================== */

  const stats = useMemo(() => {
    const active = projects.filter(
      (p) => p.status === "Active"
    ).length;

    const planning = projects.filter(
      (p) => p.status === "Planning"
    ).length;

    const completed = projects.filter(
      (p) => p.status === "Completed"
    ).length;

    const archived = projects.filter(
      (p) => p.status === "Archived"
    ).length;

    const totalProgress = projects.reduce(
      (sum, p) => sum + (p.progress || 0),
      0
    );

    const avgProgress = projects.length
      ? Math.round(
          totalProgress / projects.length
        )
      : 0;

    return {
      total: projects.length,
      active,
      planning,
      completed,
      archived,
      avgProgress,
    };
  }, [projects]);

  /* ==========================================
      QUICK INSIGHTS
  ========================================== */

  const highPriorityProjects =
    projects.filter(
      (p) =>
        p.priority === "Critical" ||
        p.priority === "High"
    ).length;

  const delayedProjects =
    projects.filter(
      (p) =>
        p.status !== "Completed" &&
        (p.progress || 0) < 30
    ).length;
      /* ==========================================
      SAVE PROJECT
  ========================================== */

  const handleSave = async (data) => {
    try {
      setActionLoading(true);

      if (selectedProject) {
        await editProject(selectedProject._id, data);

        toast.success("Project updated successfully");
      } else {
        await addProject(data);

        toast.success("Project created successfully");
      }

      setShowModal(false);
      setSelectedProject(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to save project"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================
      DELETE PROJECT
  ========================================== */

  const handleDelete = async () => {
    try {
      setActionLoading(true);

      await removeProject(selectedProject._id);

      toast.success("Project deleted successfully");

      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (error) {
      toast.error("Unable to delete project");
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================
      JSX
  ========================================== */

  return (
    <MainLayout>
      <motion.div
        className="projects-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        {/* =========================
             HERO
        ========================= */}

        <motion.section
          className="projects-hero"
          initial={{
            opacity: 0,
            y: -30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div>
            <h1>
              Project Workspace
            </h1>

            <p>
              Welcome back{" "}
              <strong>
                {user?.name || "User"}
              </strong>
              . Manage your projects,
              monitor progress and
              collaborate efficiently.
            </p>
          </div>

          {canManage && (
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="create-project-btn"
              onClick={() => {
                setSelectedProject(null);
                setShowModal(true);
              }}
            >
              + New Project
            </motion.button>
          )}
        </motion.section>

        {/* =========================
             STATS
        ========================= */}

        <motion.div
          className="project-stats-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {[
            {
              title: "Projects",
              value: stats.total,
              color: "blue",
            },
            {
              title: "Active",
              value: stats.active,
              color: "green",
            },
            {
              title: "Planning",
              value: stats.planning,
              color: "orange",
            },
            {
              title: "Completed",
              value: stats.completed,
              color: "purple",
            },
            {
              title: "Archived",
              value: stats.archived,
              color: "dark",
            },
            {
              title: "Avg Progress",
              value: `${stats.avgProgress}%`,
              color: "cyan",
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                show: {
                  opacity: 1,
                  y: 0,
                },
              }}
            >
              <StatCard
                title={card.title}
                value={card.value}
                color={card.color}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* =========================
             QUICK INSIGHTS
        ========================= */}

        <div className="project-insights">
          <motion.div
            whileHover={{
              y: -5,
            }}
            className="insight-card"
          >
            <h2>
              {stats.avgProgress}%
            </h2>

            <p>
              Average Progress
            </p>
          </motion.div>

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="insight-card"
          >
            <h2>
              {highPriorityProjects}
            </h2>

            <p>
              High Priority
            </p>
          </motion.div>

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="insight-card"
          >
            <h2>
              {delayedProjects}
            </h2>

            <p>
              Needs Attention
            </p>
          </motion.div>
        </div>

        {/* =========================
             FILTERS
        ========================= */}

        <ProjectFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={
            setStatusFilter
          }
          priorityFilter={
            priorityFilter
          }
          setPriorityFilter={
            setPriorityFilter
          }
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalProjects={
            filteredProjects.length
          }
        />

        {/* =========================
             PROJECT TABLE
        ========================= */}

        <motion.div
          className="projects-table-wrapper"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
        >
          <ProjectTable
            projects={
              paginatedProjects
            }
            loading={loading}
            canManage={canManage}
            onEdit={(project) => {
              setSelectedProject(
                project
              );

              setShowModal(true);
            }}
            onDelete={(
              project
            ) => {
              setSelectedProject(
                project
              );

              setShowDeleteModal(
                true
              );
            }}
          />
        </motion.div>
                {/* ==========================================
            PAGINATION
        ========================================== */}

        {totalPages > 1 && (
          <motion.div
            className="pagination"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
            >
              Previous
            </button>

            <div className="pagination-pages">
              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                    className={
                      currentPage === index + 1
                        ? "active"
                        : ""
                    }
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
            >
              Next
            </button>
          </motion.div>
        )}

        {/* ==========================================
            PROJECT MODAL
        ========================================== */}

        <ProjectModal
          open={showModal}
          project={selectedProject}
          loading={actionLoading}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          onSave={handleSave}
        />

        {/* ==========================================
            DELETE MODAL
        ========================================== */}

        <DeleteProjectModal
          open={showDeleteModal}
          project={selectedProject}
          loading={actionLoading}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProject(null);
          }}
          onConfirm={handleDelete}
        />
      </motion.div>
    </MainLayout>
  );
};

export default Projects;