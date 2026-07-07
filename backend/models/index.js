const sequelize = require("../config/db");
const User = require("./User");
const Project = require("./Project");
const Report = require("./Report");

// User <-> Project (a manager creates projects)
User.hasMany(Project, { foreignKey: "createdById", as: "projectsCreated" });
Project.belongsTo(User, { foreignKey: "createdById", as: "createdBy" });

// User <-> Report (a user submits many reports)
User.hasMany(Report, { foreignKey: "userId", as: "reports", onDelete: "CASCADE" });
Report.belongsTo(User, { foreignKey: "userId", as: "user" });

// Project <-> Report (a project has many reports)
Project.hasMany(Report, { foreignKey: "projectId", as: "reports" });
Report.belongsTo(Project, { foreignKey: "projectId", as: "project" });

module.exports = { sequelize, User, Project, Report };
