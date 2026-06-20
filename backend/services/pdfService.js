const PDFDocument = require("pdfkit");

/*
=====================================
GENERATE TASKS PDF REPORT
=====================================
*/
const generateTasksPDF = (tasks, res, meta = {}) => {
  const doc = new PDFDocument({ margin: 40 });

  // Set response headers
  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=taskflow-report.pdf"
  );

  // Pipe PDF to response stream
  doc.pipe(res);

  /*
  =========================
  HEADER SECTION
  =========================
  */
  doc
    .fontSize(22)
    .text("TaskFlow Report", { align: "center" });

  doc.moveDown();

  if (meta.projectName) {
    doc
      .fontSize(12)
      .text(`Project: ${meta.projectName}`);
  }

  if (meta.from && meta.to) {
    doc
      .fontSize(12)
      .text(`Date Range: ${meta.from} - ${meta.to}`);
  }

  doc.moveDown();

  /*
  =========================
  TABLE HEADER
  =========================
  */
  doc
    .fontSize(12)
    .text("No", 50)
    .text("Title", 90)
    .text("Status", 300)
    .text("Priority", 420);

  doc.moveDown();

  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc.moveDown(0.5);

  /*
  =========================
  TASK DATA
  =========================
  */
  tasks.forEach((task, index) => {
    const y = doc.y + 10;

    doc
      .fontSize(10)
      .text(index + 1, 50, y)
      .text(task.title?.substring(0, 30), 90, y)
      .text(task.status, 300, y)
      .text(task.priority || "N/A", 420, y);

    doc.moveDown();
  });

  /*
  =========================
  FOOTER
  =========================
  */
  doc.moveDown(2);

  doc
    .fontSize(10)
    .text(
      `Total Tasks: ${tasks.length}`,
      { align: "right" }
    );

  doc
    .fontSize(10)
    .text(
      `Generated on: ${new Date().toLocaleString()}`,
      { align: "right" }
    );

  doc.end();
};

module.exports = {
  generateTasksPDF,
};