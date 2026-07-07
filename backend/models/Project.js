const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, defaultValue: "" },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "Project", tableName: "projects", timestamps: true }
);

module.exports = Project;
