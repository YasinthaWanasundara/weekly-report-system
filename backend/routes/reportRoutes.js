const express = require("express");
const { body } = require("express-validator");
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get("/", getReports);
router.get("/:id", getReport);

router.post(
  "/",
  [
    body("weekStart").notEmpty().withMessage("weekStart is required"),
    body("weekEnd").notEmpty().withMessage("weekEnd is required"),
    body("project").notEmpty().withMessage("project is required"),
    body("tasksCompleted").trim().notEmpty().withMessage("tasksCompleted is required"),
    body("tasksPlanned").trim().notEmpty().withMessage("tasksPlanned is required"),
  ],
  validate,
  createReport
);

router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

module.exports = router;
