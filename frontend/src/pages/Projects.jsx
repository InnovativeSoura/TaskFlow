import { useMemo, useState, useEffect } from "react";

import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";

import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectTable from "../components/projects/ProjectTable";
import ProjectModal from "../components/projects/ProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";

import StatCard from "../components/StatCard";

import useProjects from "../hooks/useProjects";

import { useAuth } from "../context/AuthContext";

import "../styles/Project.css";

const Projects = () => {

  const { user } = useAuth();

  const {
    projects,
    loading,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  /* ===========================
      FILTER STATES
  =========================== */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Newest");

  /* ===========================
      MODAL STATES
  =========================== */

  const [showModal, setShowModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  /* ===========================
      PAGINATION
  =========================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;

  /* ===========================
      ROLE
  =========================== */

  const canManage =
    user?.role === "Admin" ||
    user?.role === "Manager";

  /* ===========================
      FILTERED PROJECTS
  =========================== */

  const filteredProjects = useMemo(() => {

    let data = [...projects];

    // Search

    if (search.trim()) {

      data = data.filter((project) => {

        const title =
          project.title?.toLowerCase() || "";

        const description =
          project.description?.toLowerCase() || "";

        const query =
          search.toLowerCase();

        return (
          title.includes(query) ||
          description.includes(query)
        );

      });

    }

    // Status

    if (statusFilter !== "All") {

      data = data.filter(

        (project) =>
          project.status === statusFilter

      );

    }

    // Sorting

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
    sortBy,
  ]);

  /* ===========================
      PAGINATION
  =========================== */

  const totalPages = Math.ceil(
    filteredProjects.length /
      itemsPerPage
  );

  const paginatedProjects =
    filteredProjects.slice(

      (currentPage - 1) * itemsPerPage,

      currentPage * itemsPerPage

    );
      /* ===========================
      STATISTICS
  =========================== */

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

    return {
      total,
      active,
      planning,
      completed,
      archived,
    };

  }, [projects]);

  /* ===========================
      CREATE PROJECT
  =========================== */

  const handleCreateProject = () => {

    setSelectedProject(null);

    setShowModal(true);

  };

  /* ===========================
      EDIT PROJECT
  =========================== */

  const handleEditProject = (project) => {

    setSelectedProject(project);

    setShowModal(true);

  };

  /* ===========================
      DELETE PROJECT
  =========================== */

  const handleDeleteClick = (project) => {

    setSelectedProject(project);

    setShowDeleteModal(true);

  };

  /* ===========================
      SAVE PROJECT
  =========================== */

  const handleSaveProject = async (projectData) => {

    try {

      if (selectedProject) {

        await editProject(
          selectedProject._id,
          projectData
        );

      } else {

        await addProject(projectData);

      }

      setShowModal(false);

      setSelectedProject(null);

    } catch (error) {

      console.error(
        "Project save failed:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to save project."
      );

    }

  };

  /* ===========================
      CONFIRM DELETE
  =========================== */

  const handleConfirmDelete = async (id) => {

    try {

      setDeleteLoading(true);

      await removeProject(id);

      setShowDeleteModal(false);

      setSelectedProject(null);

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Unable to save project."
      );

    } finally {

      setDeleteLoading(false);

    }

  };

  /* ===========================
      CLOSE MODALS
  =========================== */

  const closeProjectModal = () => {

    setShowModal(false);

    setSelectedProject(null);

  };

  const closeDeleteModal = () => {

    setShowDeleteModal(false);

    setSelectedProject(null);

  };

  /* ===========================
      PAGINATION
  =========================== */

  const goToPage = (page) => {

    if (
      page >= 1 &&
      page <= totalPages
    ) {

      setCurrentPage(page);

    }

  };

  const nextPage = () => {

    if (currentPage < totalPages) {

      setCurrentPage((prev) => prev + 1);

    }

  };

  const previousPage = () => {

    if (currentPage > 1) {

      setCurrentPage((prev) => prev - 1);

    }

  };

  /* ===========================
      RESET PAGE WHEN FILTER CHANGES
  =========================== */

  useEffect(() => {
  setCurrentPage(1);
  }, [search, statusFilter, sortBy]);
    return (

    <MainLayout>

      <div className="projects-page">

        <div className="projects-main">

          <div className="projects-container">

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <PageHeader
              title="Projects"
              subtitle="Manage all projects from one place."
            >

              {canManage && (

                <button
                  className="create-project-btn"
                  disabled={loading}
                  onClick={handleCreateProject}
                >
                    + Create Project
                </button>

              )}

            </PageHeader>

            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="project-stats">

              <StatCard
                title="Total Projects"
                value={stats.total}
                color="blue"
              />

              <StatCard
                title="Active"
                value={stats.active}
                color="green"
              />

              <StatCard
                title="Planning"
                value={stats.planning}
                color="orange"
              />

              <StatCard
                title="Completed"
                value={stats.completed}
                color="purple"
              />

              <StatCard
                title="Archived"
                value={stats.archived}
                color="dark"
              />

            </div>

            {/* =====================================
                FILTERS
            ===================================== */}

            <ProjectFilters

              search={search}

              setSearch={setSearch}

              status={statusFilter}

              setStatus={setStatusFilter}

              sortBy={sortBy}

              setSortBy={setSortBy}

            />

            {/* =====================================
                PROJECT TABLE
            ===================================== */}

            <ProjectTable

              projects={paginatedProjects}

              loading={loading}

              canManage={canManage}

              onEdit={handleEditProject}

              onDelete={handleDeleteClick}

            />

            {/* =====================================
                EMPTY STATE
            ===================================== */}

            {!loading &&
              filteredProjects.length === 0 && (

                <div className="empty-projects">

                  <h2>

                    No Projects Found

                  </h2>

                  <p>

                    Try changing your search or
                    create a new project.

                  </p>

                </div>

            )}

            {/* =====================================
                PAGINATION
            ===================================== */}

            {totalPages > 1 && (

              <div className="pagination">

                <button

                  onClick={previousPage}

                  disabled={currentPage === 1}

                >

                  Previous

                </button>

                {

                  Array.from({

                    length: totalPages

                  }).map((_, index) => (

                    <button

                      key={index}

                      className={
                        currentPage === index + 1
                          ? "active-page"
                          : ""
                      }

                      onClick={() =>
                        goToPage(index + 1)
                      }

                    >

                      {index + 1}

                    </button>

                  ))

                }

                <button

                  onClick={nextPage}

                  disabled={
                    currentPage === totalPages
                  }

                >

                  Next

                </button>

              </div>

            )}
                        {/* =====================================
                CREATE / EDIT PROJECT MODAL
            ===================================== */}

            <ProjectModal
              open={showModal}
              onClose={closeProjectModal}
              onSave={handleSaveProject}
              project={selectedProject}
            />

            {/* =====================================
                DELETE PROJECT MODAL
            ===================================== */}

            <DeleteProjectModal
              open={showDeleteModal}
              project={selectedProject}
              loading={deleteLoading}
              onClose={closeDeleteModal}
              onConfirm={() =>
                handleConfirmDelete(selectedProject?._id)
              }
            />

          </div>

        </div>

      </div>

    </MainLayout>

  );

};

export default Projects;