const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Report extends Model {}

Report.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    weekStart: { type: DataTypes.DATEONLY, allowNull: false },
    weekEnd: { type: DataTypes.DATEONLY, allowNull: false },
    tasksCompleted: { type: DataTypes.TEXT, allowNull: false },
    tasksPlanned: { type: DataTypes.TEXT, allowNull: false },
    blockers: { type: DataTypes.TEXT, defaultValue: "" },
    hoursWorked: { type: DataTypes.FLOAT, allowNull: true },
    notes: { type: DataTypes.TEXT, defaultValue: "" },
    status: {
      type: DataTypes.ENUM("draft", "submitted"),
      defaultValue: "draft",
    },
    submittedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "reports",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "weekStart", "projectId"],
      },
    ],
  }
);

module.exports = Report;
