// src/pages/Projects.jsx

import React, {
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaLayerGroup,
  FaRocket,
  FaUsers,
  FaCheckCircle,
  FaChartLine,
  FaArchive,
  FaClock,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaFlag,
  FaSortAmountDown,
  FaPlus,
  FaTimes,
  FaThLarge,
  FaList,
  FaEdit,
  FaTrash,
  FaArrowRight,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFolderOpen,
} from "react-icons/fa";

import { toast } from "react-toastify";

import { useProjects } from "../context/ProjectContext";

import "../styles/Projects.css";

import "../layouts/MainLayout.jsx";


/* ==========================================================
                      CONSTANTS
========================================================== */

const ITEMS_PER_PAGE = 6;

const EMPTY_FORM = {
  name: "",
  description: "",
  status: "Planning",
  priority: "Medium",
  startDate: "",
  dueDate: "",
};


/* ==========================================================
                      HELPERS
========================================================== */

const getProgress = (project) => {
  const value =
    project?.progress ??
    project?.completion ??
    project?.percentage ??
    0;

  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, number)
  );
};


const getProjectStatus = (project) => {

  return (
    project?.status ||
    "Planning"
  );

};


const getProjectPriority = (project) => {

  return (
    project?.priority ||
    "Medium"
  );

};


const getProjectName = (project) => {

  return (
    project?.name ||
    project?.title ||
    "Untitled Project"
  );

};


const getProjectDescription = (project) => {

  return (
    project?.description ||
    "No project description available."
  );

};


const getProjectId = (project) => {

  return (
    project?._id ||
    project?.id
  );

};


const formatDate = (date) => {

  if (!date) {
    return "No due date";
  }

  const parsed =
    new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "No due date";
  }

  return parsed.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

};


const getStatusClass = (status) => {

  const value =
    String(status)
      .toLowerCase()
      .replace(/\s+/g, "-");

  return `status-${value}`;

};


const getPriorityClass = (priority) => {

  const value =
    String(priority)
      .toLowerCase();

  return `priority-${value}`;

};


/* ==========================================================
                    PROJECT CARD
========================================================== */

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
}) => {

  const progress =
    getProgress(project);

  const status =
    getProjectStatus(project);

  const priority =
    getProjectPriority(project);

  return (

    <motion.article
      className="project-card"
      layout
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
        scale: 0.96,
      }}
      transition={{
        duration: 0.25,
      }}
      whileHover={{
        y: -5,
      }}
    >

      {/* ================================================
                    CARD TOP
      ================================================= */}

      <div className="project-card-top">

        <div className="project-icon">

          <FaLayerGroup />

        </div>

        <div className="project-card-actions">

          <button
            type="button"
            className="project-action-button"
            title="Edit project"
            onClick={() =>
              onEdit(project)
            }
          >
            <FaEdit />
          </button>

          <button
            type="button"
            className="project-action-button danger"
            title="Delete project"
            onClick={() =>
              onDelete(project)
            }
          >
            <FaTrash />
          </button>

        </div>

      </div>


      {/* ================================================
                    PROJECT TITLE
      ================================================= */}

      <div className="project-card-heading">

        <div>

          <h3>
            {getProjectName(project)}
          </h3>

          <p>
            {getProjectDescription(project)}
          </p>

        </div>

      </div>


      {/* ================================================
                    BADGES
      ================================================= */}

      <div className="project-badges">

        <span
          className={`project-status ${getStatusClass(status)}`}
        >
          <span className="status-dot" />
          {status}
        </span>

        <span
          className={`project-priority ${getPriorityClass(priority)}`}
        >
          {priority}
        </span>

      </div>


      {/* ================================================
                    PROGRESS
      ================================================= */}

      <div className="project-progress-section">

        <div className="project-progress-header">

          <span>
            Progress
          </span>

          <strong>
            {progress}%
          </strong>

        </div>

        <div className="project-progress-track">

          <motion.div
            className="project-progress-bar"
            initial={{
              width: 0,
            }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          />

        </div>

      </div>


      {/* ================================================
                    CARD FOOTER
      ================================================= */}

      <div className="project-card-footer">

        <div className="project-date">

          <FaCalendarAlt />

          <span>
            {formatDate(
              project?.dueDate
            )}
          </span>

        </div>

        <div className="project-view-link">

          View

          <FaArrowRight />

        </div>

      </div>

    </motion.article>

  );

};


/* ==========================================================
                    PROJECT ROW
========================================================== */

const ProjectRow = ({
  project,
  onEdit,
  onDelete,
}) => {

  const progress =
    getProgress(project);

  const status =
    getProjectStatus(project);

  const priority =
    getProjectPriority(project);

  return (

    <motion.div
      className="project-row"
      layout
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >

      <div className="project-row-name">

        <div className="project-row-icon">
          <FaLayerGroup />
        </div>

        <div>

          <strong>
            {getProjectName(project)}
          </strong>

          <span>
            {getProjectDescription(project)}
          </span>

        </div>

      </div>


      <span
        className={`project-status ${getStatusClass(status)}`}
      >
        <span className="status-dot" />
        {status}
      </span>


      <span
        className={`project-priority ${getPriorityClass(priority)}`}
      >
        {priority}
      </span>


      <div className="row-progress">

        <div className="row-progress-top">

          <span>
            {progress}%
          </span>

        </div>

        <div className="row-progress-track">

          <div
            className="row-progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>


      <div className="project-row-date">

        <FaCalendarAlt />

        {formatDate(
          project?.dueDate
        )}

      </div>


      <div className="project-row-actions">

        <button
          type="button"
          onClick={() =>
            onEdit(project)
          }
          title="Edit"
        >
          <FaEdit />
        </button>

        <button
          type="button"
          className="danger"
          onClick={() =>
            onDelete(project)
          }
          title="Delete"
        >
          <FaTrash />
        </button>

      </div>

    </motion.div>

  );

};


/* ==========================================================
                    PROJECT MODAL
========================================================== */

const ProjectModal = ({
  open,
  editingProject,
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
}) => {

  if (!open) {
    return null;
  }

  return (

    <AnimatePresence>

      <motion.div
        className="project-modal-overlay"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onMouseDown={(event) => {

          if (
            event.target ===
            event.currentTarget
          ) {
            onClose();
          }

        }}
      >

        <motion.div
          className="project-modal"
          initial={{
            opacity: 0,
            scale: 0.94,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.94,
            y: 20,
          }}
        >

          {/* Modal Header */}

          <div className="project-modal-header">

            <div>

              <span className="modal-eyebrow">

                <FaLayerGroup />

                PROJECT WORKSPACE

              </span>

              <h2>
                {editingProject
                  ? "Edit Project"
                  : "Create New Project"}
              </h2>

              <p>
                {editingProject
                  ? "Update your project information and progress."
                  : "Create a project and start managing your team's work."}
              </p>

            </div>

            <button
              type="button"
              className="modal-close"
              onClick={onClose}
            >
              <FaTimes />
            </button>

          </div>


          {/* Form */}

          <form
            className="project-form"
            onSubmit={onSubmit}
          >

            <div className="form-group full">

              <label>
                Project Name
              </label>

              <input
                type="text"
                placeholder="Enter project name"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                required
              />

            </div>


            <div className="form-group full">

              <label>
                Description
              </label>

              <textarea
                placeholder="Describe your project..."
                rows="4"
                value={
                  form.description
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    description:
                      event.target.value,
                  })
                }
              />

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status:
                        event.target.value,
                    })
                  }
                >

                  <option value="Planning">
                    Planning
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Archived">
                    Archived
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Priority
                </label>

                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      priority:
                        event.target.value,
                    })
                  }
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                </select>

              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  value={
                    form.startDate
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      startDate:
                        event.target.value,
                    })
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Due Date
                </label>

                <input
                  type="date"
                  value={
                    form.dueDate
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      dueDate:
                        event.target.value,
                    })
                  }
                />

              </div>

            </div>


            {/* Buttons */}

            <div className="project-modal-footer">

              <button
                type="button"
                className="modal-secondary-button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="modal-primary-button"
                disabled={saving}
              >

                {saving ? (
                  <>
                    <span className="button-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    {editingProject
                      ? "Save Changes"
                      : "Create Project"}
                  </>
                )}

              </button>

            </div>

          </form>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );

};


/* ==========================================================
                    MAIN PROJECT PAGE
========================================================== */

const Projects = () => {

  /* ========================================================
                        CONTEXT
  ======================================================== */

  const {
    projects = [],
    loading = false,
    addProject,
    editProject,
    removeProject,
  } = useProjects();


  /* ========================================================
                        STATE
  ======================================================== */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All Status");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All Priority");

  const [
    sortBy,
    setSortBy,
  ] = useState("Newest");

  const [
    viewMode,
    setViewMode,
  ] = useState("grid");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    editingProject,
    setEditingProject,
  ] = useState(null);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState(
    EMPTY_FORM
  );


  /* ========================================================
                  FILTER + SORT
  ======================================================== */

  const filteredProjects =
    useMemo(() => {

      let result = [
        ...projects,
      ];

      /* Search */

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {

        result =
          result.filter(
            (project) => {

              const name =
                getProjectName(
                  project
                ).toLowerCase();

              const description =
                getProjectDescription(
                  project
                ).toLowerCase();

              return (
                name.includes(query) ||
                description.includes(query)
              );

            }
          );

      }


      /* Status */

      if (
        statusFilter !==
        "All Status"
      ) {

        result =
          result.filter(
            (project) =>
              getProjectStatus(
                project
              ) === statusFilter
          );

      }


      /* Priority */

      if (
        priorityFilter !==
        "All Priority"
      ) {

        result =
          result.filter(
            (project) =>
              getProjectPriority(
                project
              ) === priorityFilter
          );

      }


      /* Sorting */

      result.sort(
        (a, b) => {

          if (
            sortBy ===
            "Newest"
          ) {

            return (
              new Date(
                b.createdAt ||
                b.updatedAt ||
                0
              ) -
              new Date(
                a.createdAt ||
                a.updatedAt ||
                0
              )
            );

          }

          if (
            sortBy ===
            "Oldest"
          ) {

            return (
              new Date(
                a.createdAt ||
                a.updatedAt ||
                0
              ) -
              new Date(
                b.createdAt ||
                b.updatedAt ||
                0
              )
            );

          }

          if (
            sortBy ===
            "Name"
          ) {

            return getProjectName(
              a
            ).localeCompare(
              getProjectName(b)
            );

          }

          if (
            sortBy ===
            "Progress"
          ) {

            return (
              getProgress(b) -
              getProgress(a)
            );

          }

          return 0;

        }
      );

      return result;

    }, [
      projects,
      search,
      statusFilter,
      priorityFilter,
      sortBy,
    ]);


  /* ========================================================
                      PAGINATION
  ======================================================== */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProjects.length /
        ITEMS_PER_PAGE
      )
    );

  const safePage =
    Math.min(
      currentPage,
      totalPages
    );

  const paginatedProjects =
    filteredProjects.slice(
      (safePage - 1) *
        ITEMS_PER_PAGE,
      safePage *
        ITEMS_PER_PAGE
    );


  /* ========================================================
                      STATISTICS
  ======================================================== */

  const statistics =
    useMemo(() => {

      const total =
        projects.length;

      const active =
        projects.filter(
          (project) => {

            const status =
              getProjectStatus(
                project
              ).toLowerCase();

            return (
              status === "active" ||
              status === "in progress"
            );

          }
        ).length;

      const completed =
        projects.filter(
          (project) =>
            getProjectStatus(
              project
            ).toLowerCase() ===
            "completed"
        ).length;

      const archived =
        projects.filter(
          (project) =>
            getProjectStatus(
              project
            ).toLowerCase() ===
            "archived"
        ).length;

      const highPriority =
        projects.filter(
          (project) =>
            getProjectPriority(
              project
            ).toLowerCase() ===
            "high"
        ).length;

      const needAttention =
        projects.filter(
          (project) =>
            getProgress(
              project
            ) < 30 &&
            getProjectStatus(
              project
            ).toLowerCase() !==
              "completed"
        ).length;

      const averageProgress =
        total
          ? Math.round(
              projects.reduce(
                (
                  sum,
                  project
                ) =>
                  sum +
                  getProgress(
                    project
                  ),
                0
              ) / total
            )
          : 0;

      return {
        total,
        active,
        completed,
        archived,
        highPriority,
        needAttention,
        averageProgress,
      };

    }, [
      projects,
    ]);


  /* ========================================================
                    RESET FILTERS
  ======================================================== */

  const clearFilters = () => {

    setSearch("");

    setStatusFilter(
      "All Status"
    );

    setPriorityFilter(
      "All Priority"
    );

    setSortBy(
      "Newest"
    );

    setCurrentPage(1);

  };


  /* ========================================================
                    OPEN CREATE
  ======================================================== */

  const openCreateModal = () => {

    setEditingProject(
      null
    );

    setForm({
      ...EMPTY_FORM,
    });

    setShowModal(true);

  };


  /* ========================================================
                    OPEN EDIT
  ======================================================== */

  const openEditModal = (
    project
  ) => {

    setEditingProject(
      project
    );

    setForm({

      name:
        getProjectName(
          project
        ),

      description:
        project?.description ||
        "",

      status:
        getProjectStatus(
          project
        ),

      priority:
        getProjectPriority(
          project
        ),

      startDate:
        project?.startDate
          ? String(
              project.startDate
            ).slice(0, 10)
          : "",

      dueDate:
        project?.dueDate
          ? String(
              project.dueDate
            ).slice(0, 10)
          : "",

    });

    setShowModal(true);

  };


  /* ========================================================
                    CLOSE MODAL
  ======================================================== */

  const closeModal = () => {

    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingProject(
      null
    );

    setForm({
      ...EMPTY_FORM,
    });

  };


  /* ========================================================
                    SAVE PROJECT
  ======================================================== */

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (
      !form.name.trim()
    ) {

      toast.error(
        "Project name is required."
      );

      return;

    }

    try {

      setSaving(true);

      if (editingProject) {

        await editProject(
          getProjectId(
            editingProject
          ),
          form
        );

        toast.success(
          "Project updated successfully."
        );

      } else {

        await addProject(
          form
        );

        toast.success(
          "Project created successfully."
        );

      }

      closeModal();

    } catch (error) {

      console.error(
        "Project Save Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to save project."
      );

    } finally {

      setSaving(false);

    }

  };


  /* ========================================================
                    DELETE PROJECT
  ======================================================== */

  const handleDelete = async (
    project
  ) => {

    const confirmed =
      window.confirm(
        `Delete "${getProjectName(
          project
        )}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {

      await removeProject(
        getProjectId(
          project
        )
      );

      toast.success(
        "Project deleted successfully."
      );

    } catch (error) {

      console.error(
        "Project Delete Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Unable to delete project."
      );

    }

  };


  /* ========================================================
                        RENDER
  ======================================================== */

  return (

    <div className="projects-page">

      {/* ==================================================
                    BACKGROUND EFFECTS
      ================================================== */}

      <div className="projects-background">

        <div className="projects-bg-grid" />

        <div className="projects-bg-orb orb-one" />

        <div className="projects-bg-orb orb-two" />

        <div className="projects-bg-glow" />

      </div>


      {/* ==================================================
                    MAIN CONTENT
      ================================================== */}

      <main className="projects-content">


        {/* ==================================================
                      HERO
        ================================================== */}

        <motion.section
          className="projects-hero"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <div className="hero-main">

            <span className="hero-badge">

              <FaRocket />

              PREMIUM WORKSPACE

            </span>

            <h1>

              Welcome back,

              <span>
                Souradipta Patra
              </span>

            </h1>

            <p>

              Organize projects, collaborate
              with your team, track progress,
              and manage everything from one
              intelligent workspace.

            </p>

          </div>


          <div className="workspace-score">

            <div className="score-heading">

              <span>
                Workspace Score
              </span>

              <FaChartLine />

            </div>

            <strong>
              {statistics.averageProgress}%
            </strong>

            <div className="score-progress">

              <span
                style={{
                  width: `${statistics.averageProgress}%`,
                }}
              />

            </div>

            <div className="score-mini-grid">

              <div>

                <strong>
                  {statistics.completed > 0
                    ? Math.round(
                        (statistics.completed /
                          Math.max(
                            statistics.total,
                            1
                          )) *
                          100
                      )
                    : 0}
                  %
                </strong>

                <span>
                  Completion
                </span>

              </div>

              <div>

                <strong>
                  {statistics.active > 0
                    ? Math.round(
                        (statistics.active /
                          Math.max(
                            statistics.total,
                            1
                          )) *
                          100
                      )
                    : 0}
                  %
                </strong>

                <span>
                  Active
                </span>

              </div>

            </div>

          </div>

        </motion.section>


        {/* ==================================================
                  QUICK ACTION CARDS
        ================================================== */}

        <motion.section
          className="project-shortcuts"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.08,
          }}
        >

          <button
            type="button"
            className="shortcut-card"
          >

            <span className="shortcut-icon">
              <FaLayerGroup />
            </span>

            <span className="shortcut-text">

              <strong>
                All Projects
              </strong>

              <small>
                View and manage all projects
              </small>

            </span>

          </button>


          <button
            type="button"
            className="shortcut-card create"
            onClick={
              openCreateModal
            }
          >

            <span className="shortcut-icon">
              <FaRocket />
            </span>

            <span className="shortcut-text">

              <strong>
                Create Project
              </strong>

              <small>
                Start a new project from scratch
              </small>

            </span>

          </button>


          <button
            type="button"
            className="shortcut-card"
          >

            <span className="shortcut-icon">
              <FaUsers />
            </span>

            <span className="shortcut-text">

              <strong>
                Team Collaboration
              </strong>

              <small>
                Invite team members and collaborate
              </small>

            </span>

          </button>


          <button
            type="button"
            className="shortcut-card"
          >

            <span className="shortcut-icon">
              <FaCheckCircle />
            </span>

            <span className="shortcut-text">

              <strong>
                Track Progress
              </strong>

              <small>
                Monitor project progress and milestones
              </small>

            </span>

          </button>


          <button
            type="button"
            className="shortcut-card"
          >

            <span className="shortcut-icon">
              <FaArchive />
            </span>

            <span className="shortcut-text">

              <strong>
                Project Templates
              </strong>

              <small>
                Use templates for quick setup
              </small>

            </span>

          </button>


          <button
            type="button"
            className="shortcut-card"
          >

            <span className="shortcut-icon">
              <FaChartLine />
            </span>

            <span className="shortcut-text">

              <strong>
                Analytics
              </strong>

              <small>
                View insights and project analytics
              </small>

            </span>

          </button>

        </motion.section>


        {/* ==================================================
                    STATISTICS
        ================================================== */}

        <motion.section
          className="project-statistics"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.14,
          }}
        >

          <div className="project-stat-card">

            <div className="stat-icon purple">
              <FaChartLine />
            </div>

            <div className="stat-content">

              <strong>
                {statistics.averageProgress}%
              </strong>

              <span>
                Average Progress
              </span>

            </div>

            <div className="stat-sparkline">
              ╱╲_╱╲╱
            </div>

          </div>


          <div className="project-stat-card">

            <div className="stat-icon orange">
              <FaExclamationTriangle />
            </div>

            <div className="stat-content">

              <strong>
                {statistics.highPriority}
              </strong>

              <span>
                High Priority
              </span>

            </div>

            <div className="stat-sparkline">
              ╱╲_╱╲╱
            </div>

          </div>


          <div className="project-stat-card">

            <div className="stat-icon cyan">
              <FaClock />
            </div>

            <div className="stat-content">

              <strong>
                {statistics.needAttention}
              </strong>

              <span>
                Need Attention
              </span>

            </div>

            <div className="stat-sparkline">
              ╱╲_╱╲╱
            </div>

          </div>

        </motion.section>


        {/* ==================================================
                    FILTER TOOLBAR
        ================================================== */}

        <motion.section
          className="projects-filter-panel"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.18,
          }}
        >

          <div className="filter-main">

            {/* Search */}

            <div className="project-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(event) => {

                  setSearch(
                    event.target.value
                  );

                  setCurrentPage(1);

                }}
              />

              {search && (

                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <FaTimes />
                </button>

              )}

            </div>


            {/* Status */}

            <div className="filter-control">

              <FaFilter />

              <select
                value={statusFilter}
                onChange={(event) => {

                  setStatusFilter(
                    event.target.value
                  );

                  setCurrentPage(1);

                }}
              >

                <option>
                  All Status
                </option>

                <option>
                  Planning
                </option>

                <option>
                  Active
                </option>

                <option>
                  In Progress
                </option>

                <option>
                  Completed
                </option>

                <option>
                  Archived
                </option>

              </select>

            </div>


            {/* Priority */}

            <div className="filter-control">

              <FaFlag />

              <select
                value={priorityFilter}
                onChange={(event) => {

                  setPriorityFilter(
                    event.target.value
                  );

                  setCurrentPage(1);

                }}
              >

                <option>
                  All Priority
                </option>

                <option>
                  Low
                </option>

                <option>
                  Medium
                </option>

                <option>
                  High
                </option>

              </select>

            </div>


            {/* Sort */}

            <div className="filter-control">

              <FaSortAmountDown />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >

                <option>
                  Newest
                </option>

                <option>
                  Oldest
                </option>

                <option>
                  Name
                </option>

                <option>
                  Progress
                </option>

              </select>

            </div>

          </div>


          <button
            type="button"
            className="clear-filters"
            onClick={
              clearFilters
            }
          >

            <FaTimes />

            Clear Filters

          </button>

        </motion.section>


        {/* ==================================================
                    PROJECTS HEADER
        ================================================== */}

        <section className="projects-list-section">

          <div className="projects-list-header">

            <div className="projects-count">

              <strong>
                {filteredProjects.length}
              </strong>

              <span>
                Projects
              </span>

            </div>


            <div className="projects-header-actions">

              <button
                type="button"
                className="create-project-button"
                onClick={
                  openCreateModal
                }
              >

                <FaPlus />

                Create Project

              </button>


              <div className="view-toggle">

                <button
                  type="button"
                  className={
                    viewMode ===
                    "grid"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setViewMode(
                      "grid"
                    )
                  }
                  title="Grid view"
                >
                  <FaThLarge />
                </button>

                <button
                  type="button"
                  className={
                    viewMode ===
                    "list"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setViewMode(
                      "list"
                    )
                  }
                  title="List view"
                >
                  <FaList />
                </button>

              </div>

            </div>

          </div>


          {/* =================================================
                        PROJECT CONTENT
          ================================================= */}

          {loading ? (

            <div className="projects-loading">

              <div className="loading-spinner" />

              <p>
                Loading projects...
              </p>

            </div>

          ) : paginatedProjects.length === 0 ? (

            <motion.div
              className="projects-empty"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >

              <div className="empty-project-icon">

                <FaRocket />

              </div>

              <h2>
                No Projects Yet
              </h2>

              <p>
                {projects.length === 0
                  ? "Create your first project to start managing your team's work."
                  : "No projects match your current filters."}
              </p>

              {projects.length === 0 ? (

                <button
                  type="button"
                  className="empty-create-button"
                  onClick={
                    openCreateModal
                  }
                >

                  <FaPlus />

                  Create Project

                </button>

              ) : (

                <button
                  type="button"
                  className="empty-create-button secondary"
                  onClick={
                    clearFilters
                  }
                >

                  <FaTimes />

                  Clear Filters

                </button>

              )}

            </motion.div>

          ) : viewMode === "grid" ? (

            <motion.div
              className="projects-grid"
              layout
            >

              <AnimatePresence mode="popLayout">

                {paginatedProjects.map(
                  (project) => (

                    <ProjectCard
                      key={
                        getProjectId(
                          project
                        )
                      }
                      project={
                        project
                      }
                      onEdit={
                        openEditModal
                      }
                      onDelete={
                        handleDelete
                      }
                    />

                  )
                )}

              </AnimatePresence>

            </motion.div>

          ) : (

            <motion.div
              className="projects-list"
              layout
            >

              <div className="project-row-heading">

                <span>
                  Project
                </span>

                <span>
                  Status
                </span>

                <span>
                  Priority
                </span>

                <span>
                  Progress
                </span>

                <span>
                  Due Date
                </span>

                <span>
                  Actions
                </span>

              </div>

              <AnimatePresence>

                {paginatedProjects.map(
                  (project) => (

                    <ProjectRow
                      key={
                        getProjectId(
                          project
                        )
                      }
                      project={
                        project
                      }
                      onEdit={
                        openEditModal
                      }
                      onDelete={
                        handleDelete
                      }
                    />

                  )
                )}

              </AnimatePresence>

            </motion.div>

          )}


          {/* =================================================
                        PAGINATION
          ================================================= */}

          {filteredProjects.length >
            ITEMS_PER_PAGE && (

            <div className="projects-pagination">

              <button
                type="button"
                disabled={
                  safePage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        1,
                        page - 1
                      )
                  )
                }
              >
                <FaChevronLeft />
              </button>


              <span>
                Page{" "}
                <strong>
                  {safePage}
                </strong>{" "}
                of{" "}
                <strong>
                  {totalPages}
                </strong>
              </span>


              <button
                type="button"
                disabled={
                  safePage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                  )
                }
              >
                <FaChevronRight />
              </button>

            </div>

          )}

        </section>

      </main>


      {/* ==================================================
                    PROJECT MODAL
      ================================================== */}

      <ProjectModal
        open={showModal}
        editingProject={
          editingProject
        }
        form={form}
        setForm={setForm}
        saving={saving}
        onClose={
          closeModal
        }
        onSubmit={
          handleSubmit
        }
      />

    </div>

  );

};


export default Projects;