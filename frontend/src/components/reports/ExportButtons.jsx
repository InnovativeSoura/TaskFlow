import { exportToPDF } from "../../utils/exportPDF";
import { exportToExcel } from "../../utils/exportExcel";

const ExportButtons = ({
  projects,
  tasks,
}) => {
  return (
    <div className="export-buttons">

      <button
        className="export-btn pdf-btn"
        onClick={() =>
          exportToPDF(projects, tasks)
        }
      >
        📄 Export PDF
      </button>

      <button
        className="export-btn excel-btn"
        onClick={() =>
          exportToExcel(projects, tasks)
        }
      >
        📊 Export Excel
      </button>

      <button
        className="export-btn print-btn"
        onClick={() => window.print()}
      >
        🖨 Print Report
      </button>

    </div>
  );
};

export default ExportButtons;