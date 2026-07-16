import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";

import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";

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
    projects,
    loading,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  /* ==========================================
      FILTERS
  ========================================== */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Newest");

  /* ==========================================
      MODALS
  ========================================== */

  const [showModal, setShowModal] =
    useState(false);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  /* ==========================================
      PAGINATION
  ========================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;

  /* ==========================================
      PERMISSIONS
  ========================================== */

  const canManage =
    user?.role === "Admin" ||
    user?.role === "Manager";

  /* ==========================================
      FILTER PROJECTS
  ========================================== */

  const filteredProjects = useMemo(() => {
    let data = [...projects];

    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter((project) => {
        const title =
          project.title?.toLowerCase() || "";

        const description =
          project.description?.toLowerCase() ||
          "";

        return (
          title.includes(query) ||
          description.includes(query)
        );
      });
    }

    if (statusFilter !== "All") {
      data = data.filter(
        (project) =>
          project.status === statusFilter
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

      case "Newest":
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

  /* ==========================================
      STATS
  ========================================== */

  const stats = useMemo(() => {
    return {
      total: projects.length,

      active: projects.filter(
        (p) => p.status === "Active"
      ).length,

      planning: projects.filter(
        (p) => p.status === "Planning"
      ).length,

      completed: projects.filter(
        (p) => p.status === "Completed"
      ).length,

      archived: projects.filter(
        (p) => p.status === "Archived"
      ).length,
    };
  }, [projects]);

  /* ==========================================
      CREATE
  ========================================== */

  const handleCreateProject = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  /* ==========================================
      EDIT
  ========================================== */

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  /* ==========================================
      DELETE
  ========================================== */

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  /* ==========================================
      SAVE
  ========================================== */

  const handleSaveProject = async (
    projectData
  ) => {
    try {
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
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to save project."
      );
    }
  };

  /* ==========================================
      CONFIRM DELETE
  ========================================== */

  const handleConfirmDelete = async (
    id
  ) => {
    try {
      setDeleteLoading(true);

      await removeProject(id);

      toast.success(
        "Project deleted successfully."
      );

      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete project."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ==========================================
      CLOSE MODALS
  ========================================== */

  const closeProjectModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProject(null);
  };

  /* ==========================================
      PAGINATION
  ========================================== */

  const goToPage = (page) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    sortBy,
  ]);
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

              totalProjects={filteredProjects.length}
            />

            {/* =====================================
                TABLE
            ===================================== */}

            <ProjectTable
              projects={paginatedProjects}
              loading={loading}
              canManage={canManage}
              onEdit={handleEditProject}
              onDelete={handleDeleteClick}
            />

            {/* =====================================
                EMPTY
            ===================================== */}

            {!loading &&
              filteredProjects.length === 0 && (

                <div className="empty-projects">

                  <h2>
                    No Projects Found
                  </h2>

                  <p>
                    Try changing the search,
                    filters or create a new
                    project.
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

                {Array.from({
                  length: totalPages,
                }).map((_, index) => (

                  <button
                    key={index}
                    className={
                      currentPage ===
                      index + 1
                        ? "active-page"
                        : ""
                    }
                    onClick={() =>
                      goToPage(index + 1)
                    }
                  >
                    {index + 1}
                  </button>

                ))}

                <button
                  onClick={nextPage}
                  disabled={
                    currentPage ===
                    totalPages
                  }
                >
                  Next
                </button>

              </div>

            )}

            {/* =====================================
                PROJECT MODAL
            ===================================== */}

            <ProjectModal
              open={showModal}
              project={selectedProject}
              onClose={closeProjectModal}
              onSave={handleSaveProject}
            />

            {/* =====================================
                DELETE MODAL
            ===================================== */}

            <DeleteProjectModal
              open={showDeleteModal}
              project={selectedProject}
              loading={deleteLoading}
              onClose={closeDeleteModal}
              onConfirm={() =>
                handleConfirmDelete(
                  selectedProject?._id
                )
              }
            />

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default Projects;