const ExcelJS = require("exceljs");

const generateTasksExcel = async (tasks, res) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Tasks");

  sheet.columns = [
    { header: "Title", key: "title", width: 30 },
    { header: "Status", key: "status", width: 15 },
    { header: "Priority", key: "priority", width: 15 },
    { header: "Project", key: "project", width: 25 },
  ];

  tasks.forEach((task) => {
    sheet.addRow({
      title: task.title,
      status: task.status,
      priority: task.priority,
      project: task.project?.name,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=task-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = { generateTasksExcel };