// src/pages/Projects.jsx

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import {
    FaPlus,
    FaThLarge,
    FaList,
    FaRocket,
    FaLayerGroup,
    FaCheckCircle,
    FaClock,
    FaArchive,
    FaChartLine,
    FaArrowTrendUp,
    FaExclamationTriangle,
    FaUsers,
    FaProjectDiagram,
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";

import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectModal from "../components/projects/ProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";

import StatCard from "../components/StatCard";

import useProjects from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";

import "../styles/Projects.css";

const Projects = () => {

    /* =====================================================
            AUTH
    ===================================================== */

    const { user } = useAuth();

    /* =====================================================
            PROJECTS
    ===================================================== */

    const {
        projects = [],
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

    const itemsPerPage = 6;

    const [currentPage, setCurrentPage] =
        useState(1);

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
            ROLE
    ===================================================== */

    const canManage =
        user?.role === "Admin" ||
        user?.role === "Manager";

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
                duration: 0.45,
            },
        },

    };

    /* =====================================================
            KPI ICONS
    ===================================================== */

    const statIcons = {

        total: <FaLayerGroup />,

        active: <FaRocket />,

        planning: <FaClock />,

        completed: <FaCheckCircle />,

        archived: <FaArchive />,

        progress: <FaChartLine />,

        members: <FaUsers />,

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
            FILTER + SORT
    ===================================================== */

    const filteredProjects = useMemo(() => {

        let data = [...projects];

        /* -------------------------
            SEARCH
        ------------------------- */

        if (search.trim()) {

            const keyword = search
                .toLowerCase()
                .trim();

            data = data.filter((project) =>

                project.title
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                project.description
                    ?.toLowerCase()
                    .includes(keyword)

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
            SORT
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

            case "Priority":

                const priorityOrder = {

                    Critical: 4,

                    High: 3,

                    Medium: 2,

                    Low: 1,

                };

                data.sort(

                    (a, b) =>

                        (priorityOrder[b.priority] || 0)

                        -

                        (priorityOrder[a.priority] || 0)

                );

                break;

            case "Progress":

                data.sort(

                    (a, b) =>

                        (b.progress || 0)

                        -

                        (a.progress || 0)

                );

                break;

            case "Newest":

            default:

                data.sort(

                    (a, b) =>

                        new Date(b.createdAt) -

                        new Date(a.createdAt)

                );

                break;

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

            filteredProjects.length /

            itemsPerPage

        )

    );

    const paginatedProjects = filteredProjects.slice(

        (currentPage - 1) * itemsPerPage,

        currentPage * itemsPerPage

    );

    /* =====================================================
            RESET PAGE
    ===================================================== */

    useEffect(() => {

        setCurrentPage(1);

    }, [

        search,

        statusFilter,

        priorityFilter,

        sortBy,

    ]);

    /* =====================================================
            FIX PAGE OVERFLOW
    ===================================================== */

    useEffect(() => {

        if (

            currentPage > totalPages

        ) {

            setCurrentPage(totalPages);

        }

    }, [

        totalPages,

        currentPage,

    ]);
        /* =====================================================
            DASHBOARD STATISTICS
    ===================================================== */

    const stats = useMemo(() => {

        const total = projects.length;

        const active = projects.filter(
            (project) => project.status === "Active"
        ).length;

        const planning = projects.filter(
            (project) => project.status === "Planning"
        ).length;

        const completed = projects.filter(
            (project) => project.status === "Completed"
        ).length;

        const archived = projects.filter(
            (project) => project.status === "Archived"
        ).length;

        const totalProgress = projects.reduce(

            (sum, project) =>

                sum + (project.progress || 0),

            0

        );

        const avgProgress =

            total > 0

                ? Math.round(totalProgress / total)

                : 0;

        /* -------------------------
                Total Members
        ------------------------- */

        const uniqueMembers = new Set();

        projects.forEach((project) => {

            project.members?.forEach((member) => {

                uniqueMembers.add(

                    member._id || member

                );

            });

        });

        return {

            total,

            active,

            planning,

            completed,

            archived,

            avgProgress,

            totalMembers: uniqueMembers.size,

        };

    }, [projects]);

    /* =====================================================
            PROJECT INSIGHTS
    ===================================================== */

    const highPriorityProjects = projects.filter(

        (project) =>

            project.priority === "High"

            ||

            project.priority === "Critical"

    ).length;

    const delayedProjects = projects.filter(

        (project) =>

            project.status !== "Completed"

            &&

            (project.progress || 0) < 30

    ).length;

    /* =====================================================
            COMPLETION RATE
    ===================================================== */

    const completedRate =

        stats.total > 0

            ? Math.round(

                  (stats.completed / stats.total) * 100

              )

            : 0;

    /* =====================================================
            ACTIVE RATE
    ===================================================== */

    const activeRate =

        stats.total > 0

            ? Math.round(

                  (stats.active / stats.total) * 100

              )

            : 0;

    /* =====================================================
            WORKSPACE SCORE
    ===================================================== */

    const productivityScore = Math.min(

        100,

        Math.round(

            stats.avgProgress * 0.6 +

            completedRate * 0.4

        )

    );

    /* =====================================================
            HERO SUMMARY
    ===================================================== */

    const workspaceSummary = [

        {

            title: "Projects",

            value: stats.total,

            icon: <FaProjectDiagram />,

        },

        {

            title: "Members",

            value: stats.totalMembers,

            icon: <FaUsers />,

        },

        {

            title: "Completed",

            value: `${completedRate}%`,

            icon: <FaCheckCircle />,

        },

        {

            title: "Progress",

            value: `${stats.avgProgress}%`,

            icon: <FaChartLine />,

        },

    ];
      /* =====================================================
      FILTERED PROJECTS
  ===================================================== */

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    /* Search */

    if (search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter((project) => {
        const title = project.title?.toLowerCase() || "";
        const description =
          project.description?.toLowerCase() || "";

        return (
          title.includes(query) ||
          description.includes(query)
        );
      });
    }

    /* Status */

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (project) => project.status === statusFilter
      );
    }

    /* Priority */

    if (priorityFilter !== "All") {
      filtered = filtered.filter(
        (project) =>
          project.priority === priorityFilter
      );
    }

    /* Sorting */

    switch (sortBy) {
      case "A-Z":
        filtered.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case "Z-A":
        filtered.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;

      case "Oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "Priority": {
        const priorityMap = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        filtered.sort(
          (a, b) =>
            (priorityMap[b.priority] || 0) -
            (priorityMap[a.priority] || 0)
        );

        break;
      }

      case "Progress":
        filtered.sort(
          (a, b) =>
            (b.progress || 0) -
            (a.progress || 0)
        );
        break;

      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
    }

    return filtered;
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
    Math.ceil(filteredProjects.length / itemsPerPage)
  );

  const paginatedProjects = filteredProjects.slice(
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
            p => p.status === "Active"
        ).length;

        const planning = projects.filter(
            p => p.status === "Planning"
        ).length;

        const completed = projects.filter(
            p => p.status === "Completed"
        ).length;

        const archived = projects.filter(
            p =>
                p.status === "Archived" ||
                p.archived
        ).length;

        const totalMembers = projects.reduce(
            (sum, project) =>
                sum +
                (project.members?.length || 0),
            0
        );

        const averageProgress =
            total > 0
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
            totalMembers,
            averageProgress,
        };

    }, [projects]);

    /* =====================================================
       WORKSPACE SCORE
    ===================================================== */

    const completedRate =
        stats.total > 0
            ? Math.round(
                (stats.completed / stats.total) * 100
            )
            : 0;

    const activeRate =
        stats.total > 0
            ? Math.round(
                (stats.active / stats.total) * 100
            )
            : 0;

    const productivityScore = Math.round(
        stats.averageProgress * 0.6 +
        completedRate * 0.4
    );

    const highPriorityProjects =
        projects.filter(project =>
            ["High", "Critical"].includes(
                project.priority
            )
        ).length;

    const delayedProjects =
        projects.filter(project =>
            project.status !== "Completed" &&
            (project.progress || 0) < 30
        ).length;

    /* =====================================================
       CREATE / EDIT PROJECT
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

                {/* ============================================
                    HERO
                ============================================ */}

                <section className="projects-hero">

                    <div className="hero-left">

                        <span className="hero-badge">
                            <FaRocket />
                            Workspace Overview
                        </span>

                        <h1>
                            Welcome back,
                            <span>
                                {" "}
                                {user?.name || "User"}
                            </span>
                        </h1>

                        <p>
                            Create projects, organize your team,
                            monitor progress and deliver work faster
                            from one centralized workspace.
                        </p>

                        <div className="hero-actions">

                            {canManage && (

                                <motion.button
                                    className="create-project-btn"
                                    whileHover={{
                                        scale: 1.04,
                                    }}
                                    whileTap={{
                                        scale: .96,
                                    }}
                                    onClick={openCreateModal}
                                >
                                    <FaPlus />
                                    Create Project
                                </motion.button>

                            )}

                        </div>

                    </div>

                    {/* =========================
                        RIGHT SIDE
                    ========================= */}

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

                {/* ============================================
                    STATISTICS
                ============================================ */}

                <section className="project-stats-grid">

                    <StatCard
                        title="Projects"
                        value={stats.total}
                        subtitle="Total Projects"
                        icon={<FaProjectDiagram />}
                        color="blue"
                    />

                    <StatCard
                        title="Members"
                        value={stats.totalMembers}
                        subtitle="Assigned Members"
                        icon={<FaLayerGroup />}
                        color="cyan"
                    />

                    <StatCard
                        title="Active"
                        value={stats.active}
                        subtitle="Running Projects"
                        icon={<FaRocket />}
                        color="green"
                    />

                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        subtitle="Delivered"
                        icon={<FaCheckCircle />}
                        color="purple"
                    />

                    <StatCard
                        title="Planning"
                        value={stats.planning}
                        subtitle="Upcoming"
                        icon={<FaClock />}
                        color="orange"
                    />

                    <StatCard
                        title="Progress"
                        value={`${stats.averageProgress}%`}
                        subtitle="Average Progress"
                        icon={<FaChartLine />}
                        color="pink"
                    />

                </section>
                                {/* =====================================================
                    WORKSPACE INSIGHTS
                ===================================================== */}

                <section className="project-insights">

                    <motion.div
                        className="insight-card"
                        whileHover={{ y: -4 }}
                    >
                        <FaChartLine />

                        <div>
                            <h3>{stats.averageProgress}%</h3>
                            <p>Average Progress</p>
                        </div>

                    </motion.div>

                    <motion.div
                        className="insight-card"
                        whileHover={{ y: -4 }}
                    >
                        <FaExclamationTriangle />

                        <div>
                            <h3>{highPriorityProjects}</h3>
                            <p>High Priority</p>
                        </div>

                    </motion.div>

                    <motion.div
                        className="insight-card"
                        whileHover={{ y: -4 }}
                    >
                        <FaClock />

                        <div>
                            <h3>{delayedProjects}</h3>
                            <p>Need Attention</p>
                        </div>

                    </motion.div>

                </section>

                {/* =====================================================
                    FILTERS
                ===================================================== */}

                <ProjectFilters

                    search={search}
                    setSearch={setSearch}

                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}

                    priorityFilter={priorityFilter}
                    setPriorityFilter={setPriorityFilter}

                    sortBy={sortBy}
                    setSortBy={setSortBy}

                    viewMode={viewMode}
                    setViewMode={setViewMode}

                />

                {/* =====================================================
                    PROJECT LIST
                ===================================================== */}

                <AnimatePresence mode="wait">

                    {

                        loading ? (

                            <motion.div

                                className="projects-loading"

                                initial={{ opacity: 0 }}

                                animate={{ opacity: 1 }}

                                exit={{ opacity: 0 }}

                            >

                                Loading projects...

                            </motion.div>

                        ) : filteredProjects.length === 0 ? (

                            <motion.div

                                className="empty-projects"

                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}

                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}

                                exit={{
                                    opacity: 0,
                                }}

                            >

                                <FaProjectDiagram
                                    className="empty-icon"
                                />

                                <h2>
                                    No Projects Yet
                                </h2>

                                <p>

                                    You haven't created any projects.

                                    <br />

                                    Create your first project to start
                                    managing your team's work.

                                </p>

                                {

                                    canManage && (

                                        <motion.button

                                            className="create-project-btn"

                                            whileHover={{
                                                scale: 1.05,
                                            }}

                                            whileTap={{
                                                scale: .96,
                                            }}

                                            onClick={openCreateModal}

                                        >

                                            <FaPlus />

                                            Create First Project

                                        </motion.button>

                                    )

                                }

                            </motion.div>

                        ) : (

                            <motion.div

                                layout

                                className={

                                    viewMode === "grid"

                                        ? "projects-grid"

                                        : "projects-list"

                                }

                            >

                                {

                                    paginatedProjects.map(project => (

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

                                        />

                                    ))

                                }

                            </motion.div>

                        )

                    }

                </AnimatePresence>
                                {/* =====================================================
                    PAGINATION
                ===================================================== */}

                {

                    totalPages > 1 && (

                        <div className="projects-pagination">

                            <button

                                type="button"

                                disabled={currentPage === 1}

                                onClick={() =>
                                    setCurrentPage(prev => prev - 1)
                                }

                            >

                                Previous

                            </button>

                            {

                                [...Array(totalPages)].map((_, index) => (

                                    <button

                                        key={index}

                                        type="button"

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

                                ))

                            }

                            <button

                                type="button"

                                disabled={currentPage === totalPages}

                                onClick={() =>
                                    setCurrentPage(prev => prev + 1)
                                }

                            >

                                Next

                            </button>

                        </div>

                    )

                }

                {/* =====================================================
                    PROJECT MODAL
                ===================================================== */}

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

                {/* =====================================================
                    DELETE MODAL
                ===================================================== */}

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