const Task = require("../models/Task");

const {
  generateTasksPDF,
} = require("../services/pdfService");

const {
  generateTasksExcel,
} = require("../services/excelService");

/*
================================
GET FILTERED TASKS
================================
*/
const getFilteredTasks = async (query) => {
  const filter = {};

  if (query.project) {
    filter.project = query.project;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.from && query.to) {
    filter.createdAt = {
      $gte: new Date(query.from),
      $lte: new Date(query.to),
    };
  }

  return await Task.find(filter).populate("project");
};

/*
================================
EXPORT PDF
================================
*/
const exportTasksPDF = async (req, res) => {
  try {
    const tasks = await getFilteredTasks(req.query);

    generateTasksPDF(tasks, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
================================
EXPORT EXCEL
================================
*/
const exportTasksExcel = async (req, res) => {
  try {
    const tasks = await getFilteredTasks(req.query);

    await generateTasksExcel(tasks, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  exportTasksPDF,
  exportTasksExcel,
};