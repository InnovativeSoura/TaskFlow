import MainLayout from "../layouts/MainLayout";

import ReportsHeader from "../components/reports/ReportsHeader";
import ReportCards from "../components/reports/ReportCards";
import TaskStatusChart from "../components/reports/TaskStatusChart";
import ProjectProgressChart from "../components/reports/ProjectProgressChart";
import PriorityChart from "../components/reports/PriorityChart";
import ExportButtons from "../components/reports/ExportButtons";

import { useProjects } from "../context/ProjectContext";
import { useTasks } from "../context/TaskContext";

import "../styles/Reports.css";

const Reports = () => {
  const { projects } = useProjects();
  const { tasks } = useTasks();

  return (
    <MainLayout>

      <ReportsHeader />

      <ReportCards
        projects={projects}
        tasks={tasks}
      />

      <div className="reports-grid">

        <TaskStatusChart tasks={tasks} />

        <ProjectProgressChart
          projects={projects}
        />

        <PriorityChart
          tasks={tasks}
        />

      </div>

      <ExportButtons
        projects={projects}
        tasks={tasks}
      />

    </MainLayout>
  );
};

export default Reports;