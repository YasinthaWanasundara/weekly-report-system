const express = require("express");
const {
  getSummary,
  getSubmissionStatus,
  getTasksTrend,
  getWorkloadByProject,
  getRecentActivity,
} = require("../controllers/dashboardController");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(protect, requireRole("manager"));

router.get("/summary", getSummary);
router.get("/submission-status", getSubmissionStatus);
router.get("/tasks-trend", getTasksTrend);
router.get("/workload-by-project", getWorkloadByProject);
router.get("/recent-activity", getRecentActivity);

module.exports = router;
