import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (
  projects,
  tasks
) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(
    "TaskFlow Report",
    14,
    18
  );

  doc.setFontSize(12);

  doc.text(
    `Generated : ${new Date().toLocaleString()}`,
    14,
    28
  );

  doc.text(
    `Projects : ${projects.length}`,
    14,
    38
  );

  doc.text(
    `Tasks : ${tasks.length}`,
    14,
    46
  );

  autoTable(doc, {
    startY: 58,

    head: [[
      "Task",
      "Priority",
      "Status",
      "Due Date",
    ]],

    body: tasks.map((task) => [
      task.title || task.name,

      task.priority,

      task.status,

      task.dueDate
        ? new Date(
            task.dueDate
          ).toLocaleDateString()
        : "-",
    ]),
  });

  doc.save("TaskFlow-Report.pdf");
};