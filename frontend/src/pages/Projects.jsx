import {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  toast,
} from "react-toastify";


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


  const {
    user
  } = useAuth();



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


  const [
    search,
    setSearch
  ] = useState("");



  const [
    statusFilter,
    setStatusFilter
  ] = useState("All");



  const [
    priorityFilter,
    setPriorityFilter
  ] = useState("All");



  const [
    sortBy,
    setSortBy
  ] = useState("Newest");





  /* ==========================================
      MODALS
  ========================================== */


  const [
    showModal,
    setShowModal
  ] = useState(false);



  const [
    showDeleteModal,
    setShowDeleteModal
  ] = useState(false);



  const [
    selectedProject,
    setSelectedProject
  ] = useState(null);



  const [
    actionLoading,
    setActionLoading
  ] = useState(false);







  const canManage =
    user?.role === "Admin" ||
    user?.role === "Manager";






  /* ==========================================
      FILTER + SORT
  ========================================== */


  const filteredProjects =
    useMemo(()=>{


      let data =
        [...projects];



      if(search.trim()){


        const query =
          search.toLowerCase();



        data =
          data.filter(
            (project)=>

              project.title
              ?.toLowerCase()
              .includes(query)

              ||

              project.description
              ?.toLowerCase()
              .includes(query)

          );


      }




      if(
        statusFilter !== "All"
      ){

        data =
          data.filter(
            (project)=>
              project.status === statusFilter
          );

      }




      if(
        priorityFilter !== "All"
      ){

        data =
          data.filter(
            (project)=>
              project.priority === priorityFilter
          );

      }





      switch(sortBy){


        case "A-Z":

          data.sort(
            (a,b)=>
              a.title.localeCompare(
                b.title
              )
          );

          break;




        case "Z-A":

          data.sort(
            (a,b)=>
              b.title.localeCompare(
                a.title
              )
          );

          break;




        case "Oldest":

          data.sort(
            (a,b)=>
              new Date(a.createdAt)
              -
              new Date(b.createdAt)
          );

          break;




        case "Priority":

          const priorityOrder = {

            Critical:4,
            High:3,
            Medium:2,
            Low:1

          };


          data.sort(
            (a,b)=>
              priorityOrder[b.priority]
              -
              priorityOrder[a.priority]
          );


          break;




        case "Progress":

          data.sort(
            (a,b)=>
              (b.progress || 0)
              -
              (a.progress || 0)
          );

          break;




        default:

          data.sort(
            (a,b)=>
              new Date(b.createdAt)
              -
              new Date(a.createdAt)
          );


      }



      return data;


    },[

      projects,
      search,
      statusFilter,
      priorityFilter,
      sortBy

    ]);







  /* ==========================================
      PAGINATION
  ========================================== */


  const [
    currentPage,
    setCurrentPage
  ] = useState(1);



  const itemsPerPage = 8;



  const totalPages =
    Math.ceil(
      filteredProjects.length /
      itemsPerPage
    );



  const paginatedProjects =
    filteredProjects.slice(
      (currentPage - 1)
      *
      itemsPerPage,

      currentPage *
      itemsPerPage
    );






  useEffect(()=>{

    setCurrentPage(1);

  },[
    search,
    statusFilter,
    priorityFilter,
    sortBy
  ]);







  /* ==========================================
      STATS
  ========================================== */


  const stats =
    useMemo(()=>({

      total:
        projects.length,


      active:
        projects.filter(
          p=>p.status==="Active"
        ).length,


      planning:
        projects.filter(
          p=>p.status==="Planning"
        ).length,


      completed:
        projects.filter(
          p=>p.status==="Completed"
        ).length,


      archived:
        projects.filter(
          p=>p.status==="Archived"
        ).length,


    }),[
      projects
    ]);







  /* ==========================================
      SAVE PROJECT
  ========================================== */


  const handleSave =
    async(data)=>{


      try{


        setActionLoading(true);



        if(selectedProject){


          await editProject(
            selectedProject._id,
            data
          );


          toast.success(
            "Project updated successfully"
          );


        }

        else{


          await addProject(
            data
          );


          toast.success(
            "Project created successfully"
          );


        }




        setShowModal(false);

        setSelectedProject(null);



      }

      catch(error){


        toast.error(
          error?.response?.data?.message ||
          "Unable to save project"
        );


      }

      finally{


        setActionLoading(false);


      }


    };






  const handleDelete =
    async()=>{


      try{


        setActionLoading(true);



        await removeProject(
          selectedProject._id
        );



        toast.success(
          "Project deleted successfully"
        );



        setShowDeleteModal(false);

        setSelectedProject(null);



      }

      catch(error){


        toast.error(
          "Unable to delete project"
        );


      }

      finally{

        setActionLoading(false);

      }


    };








  return (

    <MainLayout>


      <div className="projects-page">



        <PageHeader

          title="Projects"

          subtitle="Manage all projects from one place."

        >


          {
            canManage && (

              <button

                className="create-project-btn"

                onClick={()=>{

                  setSelectedProject(null);

                  setShowModal(true);

                }}

              >

                + Create Project

              </button>


            )
          }



        </PageHeader>






        <div className="project-stats-grid">


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







        <ProjectFilters


          search={search}

          setSearch={setSearch}



          statusFilter={statusFilter}

          setStatusFilter={setStatusFilter}



          priorityFilter={priorityFilter}

          setPriorityFilter={setPriorityFilter}



          sortBy={sortBy}

          setSortBy={setSortBy}



          totalProjects={
            filteredProjects.length
          }


        />







        <ProjectTable


          projects={
            paginatedProjects
          }


          loading={loading}


          canManage={canManage}


          onEdit={(project)=>{

            setSelectedProject(project);

            setShowModal(true);

          }}


          onDelete={(project)=>{

            setSelectedProject(project);

            setShowDeleteModal(true);

          }}


        />







        <ProjectModal

          open={showModal}

          project={selectedProject}

          loading={actionLoading}

          onClose={()=>setShowModal(false)}

          onSave={handleSave}

        />





        <DeleteProjectModal

          open={showDeleteModal}

          project={selectedProject}

          loading={actionLoading}

          onClose={()=>setShowDeleteModal(false)}

          onConfirm={handleDelete}

        />



      </div>



    </MainLayout>

  );


};


export default Projects;