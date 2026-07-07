const { Project } = require("../models");

// GET /api/projects
exports.getProjects = async (req, res) => {
  const projects = await Project.findAll({
    where: { isActive: true },
    order: [["name", "ASC"]],
  });
  res.json(projects);
};

// POST /api/projects  (manager only)
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description, createdById: req.user.id });
    res.status(201).json(project);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Project name already exists" });
    }
    res.status(500).json({ message: "Failed to create project", error: err.message });
  }
};

// PUT /api/projects/:id (manager only)
exports.updateProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const { name, description } = req.body;
  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;

  try {
    await project.save();
    res.json(project);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Project name already exists" });
    }
    res.status(500).json({ message: "Failed to update project", error: err.message });
  }
};

// DELETE /api/projects/:id (manager only) - soft delete
exports.deleteProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  project.isActive = false;
  await project.save();
  res.json({ message: "Project removed" });
};
