const { Op } = require("sequelize");
const { Report, User, Project } = require("../models");

const includeRelations = [
  { model: User, as: "user", attributes: ["id", "name", "email"] },
  { model: Project, as: "project", attributes: ["id", "name"] },
];

// GET /api/reports
// Members see only their own reports. Managers can see everyone's, with filters.
exports.getReports = async (req, res) => {
  const { member, project, from, to, status } = req.query;
  const where = {};

  if (req.user.role === "member") {
    where.userId = req.user.id;
  } else if (member) {
    where.userId = member;
  }

  if (project) where.projectId = project;
  if (status) where.status = status;
  if (from || to) {
    where.weekStart = {};
    if (from) where.weekStart[Op.gte] = from;
    if (to) where.weekStart[Op.lte] = to;
  }

  const reports = await Report.findAll({
    where,
    include: includeRelations,
    order: [["weekStart", "DESC"]],
  });

  res.json(reports);
};

// GET /api/reports/:id
exports.getReport = async (req, res) => {
  const report = await Report.findByPk(req.params.id, { include: includeRelations });
  if (!report) return res.status(404).json({ message: "Report not found" });

  if (req.user.role === "member" && report.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  res.json(report);
};

// POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const {
      weekStart,
      weekEnd,
      project,
      tasksCompleted,
      tasksPlanned,
      blockers,
      hoursWorked,
      notes,
      status,
    } = req.body;

    const report = await Report.create({
      userId: req.user.id,
      weekStart,
      weekEnd,
      projectId: project,
      tasksCompleted,
      tasksPlanned,
      blockers,
      hoursWorked: hoursWorked !== undefined && hoursWorked !== "" ? Number(hoursWorked) : null,
      notes,
      status: status === "submitted" ? "submitted" : "draft",
      submittedAt: status === "submitted" ? new Date() : null,
    });

    res.status(201).json(report);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "A report for this project and week already exists" });
    }
    res.status(500).json({ message: "Failed to create report", error: err.message });
  }
};

// PUT /api/reports/:id  (owner only)
exports.updateReport = async (req, res) => {
  const report = await Report.findByPk(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });

  if (report.userId !== req.user.id) {
    return res.status(403).json({ message: "You can only edit your own reports" });
  }

  const wasSubmitted = report.status === "submitted";

  const fields = [
    "weekStart",
    "weekEnd",
    "tasksCompleted",
    "tasksPlanned",
    "blockers",
    "hoursWorked",
    "notes",
    "status",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) report[f] = req.body[f] === "" ? null : req.body[f];
  });
  if (req.body.project !== undefined) report.projectId = req.body.project;

  if (req.body.status === "submitted" && !wasSubmitted) {
    report.submittedAt = new Date();
  }

  await report.save();
  res.json(report);
};

// DELETE /api/reports/:id (owner only)
exports.deleteReport = async (req, res) => {
  const report = await Report.findByPk(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });
  if (report.userId !== req.user.id) {
    return res.status(403).json({ message: "You can only delete your own reports" });
  }
  await report.destroy();
  res.json({ message: "Report deleted" });
};
