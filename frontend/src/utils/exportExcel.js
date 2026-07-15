import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (
  projects,
  tasks
) => {
  const workbook =
    XLSX.utils.book_new();

  const projectSheet =
    XLSX.utils.json_to_sheet(
      projects
    );

  const taskSheet =
    XLSX.utils.json_to_sheet(
      tasks
    );

  XLSX.utils.book_append_sheet(
    workbook,
    projectSheet,
    "Projects"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    taskSheet,
    "Tasks"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    file,
    "TaskFlow-Report.xlsx"
  );
};