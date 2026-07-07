const express = require("express");
const { body } = require("express-validator");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get("/", getProjects);

router.post(
  "/",
  requireRole("manager"),
  [body("name").trim().notEmpty().withMessage("Project name is required")],
  validate,
  createProject
);

router.put(
  "/:id",
  requireRole("manager"),
  [body("name").optional().trim().notEmpty()],
  validate,
  updateProject
);

router.delete("/:id", requireRole("manager"), deleteProject);

module.exports = router;
