// src/pages/Projects.jsx

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaPlus,
  FaRocket,
  FaLayerGroup,
  FaClock,
  FaCheckCircle,
  FaArchive,
  FaChartLine,
  FaExclamationTriangle,
  FaThLarge,
  FaList,
} from "react-icons/fa";

import { FaArrowTrendUp } from "react-icons/fa6";

import MainLayout from "../layouts/MainLayout";

import ProjectCard from "../components/projects/ProjectCard";
import ProjectModal from "../components/projects/ProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";
import ProjectFilters from "../components/projects/ProjectFilters";
import StatCard from "../components/StatCard";

import useProjects from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";

import "../styles/Projects.css";

const Projects = () => {

  /* =====================================================
      AUTH
  ===================================================== */

  const { user } = useAuth();

  const canManage =
    user?.role === "Admin" ||
    user?.role === "Manager";

  /* =====================================================
      PROJECTS
  ===================================================== */

  const {
    projects,
    loading,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  /* =====================================================
      SEARCH
  ===================================================== */

  const [search, setSearch] = useState("");

  /* =====================================================
      FILTERS
  ===================================================== */

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Newest");

  /* =====================================================
      VIEW MODE
  ===================================================== */

  const [viewMode, setViewMode] =
    useState("grid");

  /* =====================================================
      PAGINATION
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;

  /* =====================================================
      MODALS
  ===================================================== */

  const [showModal, setShowModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);
      /* =====================================================
      FILTER + SORT
  ===================================================== */

  const filteredProjects = useMemo(() => {

    let data = [...projects];

    /* -------------------------
        SEARCH
    ------------------------- */

    if (search.trim()) {

      const query = search
        .toLowerCase()
        .trim();

      data = data.filter((project) =>

        project.title
          ?.toLowerCase()
          .includes(query)

        ||

        project.description
          ?.toLowerCase()
          .includes(query)

      );

    }

    /* -------------------------
        STATUS
    ------------------------- */

    if (statusFilter !== "All") {

      data = data.filter(
        (project) =>
          project.status === statusFilter
      );

    }

    /* -------------------------
        PRIORITY
    ------------------------- */

    if (priorityFilter !== "All") {

      data = data.filter(
        (project) =>
          project.priority === priorityFilter
      );

    }

    /* -------------------------
        SORTING
    ------------------------- */

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

        const order = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        data.sort(
          (a, b) =>
            (order[b.priority] || 0) -
            (order[a.priority] || 0)
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

  /* =====================================================
      PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProjects.length / itemsPerPage
    )
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

  /* =====================================================
      PROJECT STATISTICS
  ===================================================== */

  const stats = useMemo(() => {

    const total = projects.length;

    const active = projects.filter(
      (project) =>
        project.status === "Active"
    ).length;

    const planning = projects.filter(
      (project) =>
        project.status === "Planning"
    ).length;

    const completed = projects.filter(
      (project) =>
        project.status === "Completed"
    ).length;

    const archived = projects.filter(
      (project) =>
        project.status === "Archived"
    ).length;

    const avgProgress = total
      ? Math.round(

          projects.reduce(

            (sum, project) =>
              sum + (project.progress || 0),

            0

          ) / total

        )
      : 0;

    return {

      total,

      active,

      planning,

      completed,

      archived,

      avgProgress,

    };

  }, [projects]);
    /* =====================================================
      INSIGHTS
  ===================================================== */

  const highPriorityProjects = useMemo(() => {

    return projects.filter(

      (project) =>

        project.priority === "Critical" ||

        project.priority === "High"

    ).length;

  }, [projects]);

  const delayedProjects = useMemo(() => {

    return projects.filter(

      (project) =>

        project.status !== "Completed" &&

        (project.progress || 0) < 30

    ).length;

  }, [projects]);

  const completedRate = useMemo(() => {

    if (stats.total === 0) return 0;

    return Math.round(

      (stats.completed / stats.total) * 100

    );

  }, [stats]);

  const activeRate = useMemo(() => {

    if (stats.total === 0) return 0;

    return Math.round(

      (stats.active / stats.total) * 100

    );

  }, [stats]);

  const productivityScore = useMemo(() => {

    return Math.min(

      100,

      Math.round(

        (stats.avgProgress * 0.6) +

        (completedRate * 0.4)

      )

    );

  }, [

    stats.avgProgress,

    completedRate,

  ]);

  /* =====================================================
      PAGE ANIMATION
  ===================================================== */

  const pageVariants = {

    hidden: {

      opacity: 0,

      y: 25,

    },

    visible: {

      opacity: 1,

      y: 0,

      transition: {

        duration: 0.4,

      },

    },

  };

  /* =====================================================
      STAT ICONS
  ===================================================== */

  const statIcons = {

    total: <FaLayerGroup />,

    active: <FaRocket />,

    planning: <FaClock />,

    completed: <FaCheckCircle />,

    archived: <FaArchive />,

    progress: <FaChartLine />,

  };

  /* =====================================================
      HERO ACTIONS
  ===================================================== */

  const openCreateModal = () => {

    setSelectedProject(null);

    setShowModal(true);

  };

  const openEditModal = (project) => {

    setSelectedProject(project);

    setShowModal(true);

  };

  const openDeleteModal = (project) => {

    setSelectedProject(project);

    setShowDeleteModal(true);

  };
    /* =====================================================
      SAVE PROJECT
  ===================================================== */

  const handleSave = async (projectData) => {

    try {

      setActionLoading(true);

      if (selectedProject) {

        await editProject(
          selectedProject._id,
          projectData
        );

        toast.success(
          "Project updated successfully."
        );

      } else {

        await addProject(projectData);

        toast.success(
          "Project created successfully."
        );

      }

      setShowModal(false);

      setSelectedProject(null);

    } catch (error) {

      toast.error(

        error?.response?.data?.message ||

        "Unable to save project."

      );

    } finally {

      setActionLoading(false);

    }

  };

  /* =====================================================
      DELETE PROJECT
  ===================================================== */

  const handleDelete = async () => {

    if (!selectedProject) return;

    try {

      setActionLoading(true);

      await removeProject(selectedProject._id);

      toast.success(
        "Project deleted successfully."
      );

      setShowDeleteModal(false);

      setSelectedProject(null);

    } catch (error) {

      toast.error(

        error?.response?.data?.message ||

        "Unable to delete project."

      );

    } finally {

      setActionLoading(false);

    }

  };

  /* =====================================================
      JSX
  ===================================================== */

  return (

    <MainLayout>

      <motion.div
        className="projects-page"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >

        {/* ==========================================
            HERO
        ========================================== */}

        <section className="projects-hero">

          <div className="hero-left">

            <span className="hero-badge">

              <FaRocket />

              Premium Workspace

            </span>

            <h1>

              Welcome back,

              <span>

                {" "}

                {user?.name || "User"}

              </span>

            </h1>

            <p>

              Organize projects,

              collaborate with your team,

              track progress,

              and manage everything

              from one intelligent workspace.

            </p>

            {canManage && (

              <motion.button
                className="create-project-btn"
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={openCreateModal}
              >

                <FaPlus />

                New Project

              </motion.button>

            )}

          </div>

          {/* ==========================================
              HERO RIGHT
          ========================================== */}

          <div className="hero-right">

            <div className="workspace-summary">

              <div>

                <small>

                  Workspace Score

                </small>

                <h2>

                  {productivityScore}%

                </h2>

              </div>

              <FaArrowTrendUp />

            </div>

            <div className="workspace-progress">

              <div className="workspace-progress-bar">

                <motion.div
                  className="workspace-progress-fill"
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${productivityScore}%`,
                  }}
                  transition={{
                    duration: 1,
                  }}
                />

              </div>

            </div>

            <div className="workspace-stats">

              <div>

                <span>

                  Completion

                </span>

                <strong>

                  {completedRate}%

                </strong>

              </div>

              <div>

                <span>

                  Active

                </span>

                <strong>

                  {activeRate}%

                </strong>

              </div>

            </div>

          </div>

        </section>
                {/* ==========================================
            STATISTICS
        ========================================== */}

        <section className="projects-stats">

          <StatCard
            title="Projects"
            value={stats.total}
            subtitle="Total Projects"
            icon={statIcons.total}
            color="blue"
          />

          <StatCard
            title="Active"
            value={stats.active}
            subtitle="Running"
            icon={statIcons.active}
            color="green"
          />

          <StatCard
            title="Planning"
            value={stats.planning}
            subtitle="Upcoming"
            icon={statIcons.planning}
            color="orange"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Delivered"
            icon={statIcons.completed}
            color="purple"
          />

          <StatCard
            title="Archived"
            value={stats.archived}
            subtitle="Stored"
            icon={statIcons.archived}
            color="dark"
          />

          <StatCard
            title="Progress"
            value={`${stats.avgProgress}%`}
            subtitle="Average"
            icon={statIcons.progress}
            color="cyan"
          />

        </section>

        {/* ==========================================
            INSIGHTS
        ========================================== */}

        <section className="project-insights">

          <motion.div
            whileHover={{ y: -5 }}
            className="insight-card"
          >
            <FaChartLine />

            <h2>{stats.avgProgress}%</h2>

            <p>Average Progress</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="insight-card"
          >
            <FaExclamationTriangle />

            <h2>{highPriorityProjects}</h2>

            <p>High Priority</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="insight-card"
          >
            <FaClock />

            <h2>{delayedProjects}</h2>

            <p>Need Attention</p>
          </motion.div>

        </section>

        {/* ==========================================
            FILTERS
        ========================================== */}

        <ProjectFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* ==========================================
            VIEW TOGGLE
        ========================================== */}

        <div className="projects-toolbar">

          <div className="projects-count">

            <strong>
              {filteredProjects.length}
            </strong>

            {" "}Project{filteredProjects.length !== 1 ? "s" : ""}

          </div>

          <div className="view-toggle">

            <button
              className={
                viewMode === "grid"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setViewMode("grid")
              }
            >
              <FaThLarge />
            </button>

            <button
              className={
                viewMode === "list"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setViewMode("list")
              }
            >
              <FaList />
            </button>

          </div>

        </div>
                {/* ==========================================
            PROJECT LIST
        ========================================== */}

        {loading ? (

          <div className="projects-loading">

            <div className="loader" />

            <p>Loading projects...</p>

          </div>

        ) : filteredProjects.length === 0 ? (

          <motion.div
            className="projects-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <FaRocket className="empty-icon" />

            <h2>No Projects Yet</h2>

            <p>
              Create your first project to start managing
              your team's work.
            </p>

            {canManage && (

              <button
                className="create-project-btn"
                onClick={openCreateModal}
              >

                <FaPlus />

                Create First Project

              </button>

            )}

          </motion.div>

        ) : (

          <>

            <motion.div
              layout
              className={
                viewMode === "grid"
                  ? "projects-grid"
                  : "projects-list"
              }
            >

              <AnimatePresence>

                {paginatedProjects.map((project) => (

                  <ProjectCard
                    key={project._id}
                    project={project}
                    viewMode={viewMode}
                    onEdit={() =>
                      openEditModal(project)
                    }
                    onDelete={() =>
                      openDeleteModal(project)
                    }
                    canManage={canManage}
                  />

                ))}

              </AnimatePresence>

            </motion.div>

            {/* ==========================================
                PAGINATION
            ========================================== */}

            {totalPages > 1 && (

              <div className="pagination">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => (

                    <button
                      key={index}
                      className={
                        currentPage === index + 1
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(index + 1)
                      }
                    >
                      {index + 1}
                    </button>

                  )
                )}

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                    )
                  }
                >
                  Next
                </button>

              </div>

            )}

          </>

        )}

        {/* ==========================================
            CREATE / EDIT PROJECT
        ========================================== */}

        <ProjectModal
          open={showModal}
          project={selectedProject}
          loading={actionLoading}
          users={[]}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          onSave={handleSave}
        />

        {/* ==========================================
            DELETE PROJECT
        ========================================== */}

        <DeleteProjectModal
          open={showDeleteModal}
          project={selectedProject}
          loading={actionLoading}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProject(null);
          }}
          onDelete={handleDelete}
        />

      </motion.div>

    </MainLayout>

  );

};

export default Projects;