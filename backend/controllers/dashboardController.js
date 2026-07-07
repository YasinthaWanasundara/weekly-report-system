const { Op, fn, col } = require("sequelize");
const { Report, User, Project, sequelize } = require("../models");

// Helper: resolve the Monday..Sunday window for a given "week" query param
// (an ISO date string of any day in the target week). Defaults to current week.
function getWeekRange(weekParam) {
  const ref = weekParam ? new Date(weekParam) : new Date();
  const day = ref.getDay(); // 0 = Sunday
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { weekStart: monday, weekEnd: sunday };
}

// GET /api/dashboard/summary?week=YYYY-MM-DD
exports.getSummary = async (req, res) => {
  const { weekStart, weekEnd } = getWeekRange(req.query.week);

  const totalMembers = await User.count({ where: { role: "member" } });
  const reportsThisWeek = await Report.findAll({
    where: { weekStart: { [Op.gte]: weekStart, [Op.lte]: weekEnd } },
  });

  const submitted = reportsThisWeek.filter((r) => r.status === "submitted").length;
  const membersSubmitted = new Set(
    reportsThisWeek.filter((r) => r.status === "submitted").map((r) => r.userId)
  ).size;

  const openBlockers = reportsThisWeek.filter(
    (r) => r.blockers && r.blockers.trim().length > 0
  ).length;

  const complianceRate =
    totalMembers === 0 ? 0 : Math.round((membersSubmitted / totalMembers) * 100);

  res.json({
    weekStart,
    weekEnd,
    totalMembers,
    reportsSubmitted: submitted,
    complianceRate,
    openBlockers,
    pendingMembers: totalMembers - membersSubmitted,
  });
};

// GET /api/dashboard/submission-status?week=YYYY-MM-DD
// Per-member status: submitted / pending / late for the selected week
exports.getSubmissionStatus = async (req, res) => {
  const { weekStart, weekEnd } = getWeekRange(req.query.week);
  const members = await User.findAll({
    where: { role: "member" },
    attributes: ["id", "name", "email"],
  });

  const reports = await Report.findAll({
    where: { weekStart: { [Op.gte]: weekStart, [Op.lte]: weekEnd } },
  });

  const now = new Date();
  const isPastDeadline = now > weekEnd;

  const statusByMember = members.map((m) => {
    const memberReports = reports.filter((r) => r.userId === m.id);
    const submitted = memberReports.some((r) => r.status === "submitted");
    let status = "pending";
    if (submitted) status = "submitted";
    else if (isPastDeadline) status = "late";
    return {
      memberId: m.id,
      name: m.name,
      email: m.email,
      status,
      reportsCount: memberReports.length,
    };
  });

  res.json(statusByMember);
};

// GET /api/dashboard/tasks-trend?weeks=8&member=<id>
// Reports-submitted count per week, over the last N weeks
exports.getTasksTrend = async (req, res) => {
  const weeksBack = Number.parseInt(req.query.weeks, 10) || 8;
  const since = new Date();
  since.setDate(since.getDate() - weeksBack * 7);

  const where = { weekStart: { [Op.gte]: since }, status: "submitted" };
  if (req.query.member) where.userId = req.query.member;

  const rows = await Report.findAll({
    where,
    attributes: ["weekStart", [fn("COUNT", col("id")), "reportsSubmitted"]],
    group: ["weekStart"],
    order: [["weekStart", "ASC"]],
    raw: true,
  });

  res.json(
    rows.map((r) => ({
      weekStart: r.weekStart,
      reportsSubmitted: Number.parseInt(r.reportsSubmitted, 10),
    }))
  );
};

// GET /api/dashboard/workload-by-project?week=YYYY-MM-DD
exports.getWorkloadByProject = async (req, res) => {
  const { weekStart, weekEnd } = getWeekRange(req.query.week);

  const rows = await Report.findAll({
    where: { weekStart: { [Op.gte]: weekStart, [Op.lte]: weekEnd } },
    attributes: [
      "projectId",
      [fn("SUM", col("hoursWorked")), "totalHours"],
      [fn("COUNT", col("Report.id")), "reportCount"],
    ],
    include: [{ model: Project, as: "project", attributes: ["name"] }],
    group: ["projectId", "project.id"],
    raw: true,
    nest: true,
  });

  const workload = rows
    .map((r) => ({
      projectId: r.projectId,
      projectName: r.project?.name || "Unknown",
      totalHours: Number(r.totalHours) || 0,
      reportCount: Number.parseInt(r.reportCount, 10),
    }))
    .sort((a, b) => b.totalHours - a.totalHours);

  res.json(workload);
};

// GET /api/dashboard/recent-activity?limit=10
exports.getRecentActivity = async (req, res) => {
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const reports = await Report.findAll({
    where: { status: "submitted" },
    include: [
      { model: User, as: "user", attributes: ["name"] },
      { model: Project, as: "project", attributes: ["name"] },
    ],
    order: [["submittedAt", "DESC"]],
    limit,
  });

  res.json(
    reports.map((r) => ({
      id: r.id,
      user: r.user?.name,
      project: r.project?.name,
      submittedAt: r.submittedAt,
      weekStart: r.weekStart,
    }))
  );
};
