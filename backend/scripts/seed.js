// Populates the database with a manager, several team members, projects,
// and a few weeks of reports so the dashboard has something to show.
// Run with: npm run seed  (from the backend/ folder)
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Project, Report } = require("../models");

function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function seed() {
  await sequelize.sync({ force: true }); // drops and recreates tables — demo data only!
  console.log("Tables reset.");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const manager = await User.create({
    name: "Priya Manager",
    email: "manager@demo.com",
    password: hashedPassword,
    role: "manager",
  });

  const memberNames = ["Asha Perera", "Kavindu Silva", "Nadia Fernando"];
  const members = [];
  for (let i = 0; i < memberNames.length; i++) {
    const member = await User.create({
      name: memberNames[i],
      email: `member${i + 1}@demo.com`,
      password: hashedPassword,
      role: "member",
    });
    members.push(member);
  }

  const projectNames = ["Client A", "Internal Tooling", "R&D", "Marketing"];
  const projects = [];
  for (const name of projectNames) {
    const project = await Project.create({
      name,
      description: `${name} workstream`,
      createdById: manager.id,
    });
    projects.push(project);
  }

  const today = new Date();
  for (let weeksAgo = 3; weeksAgo >= 0; weeksAgo--) {
    const weekStart = mondayOf(new Date(today.getTime() - weeksAgo * 7 * 86400000));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    for (let idx = 0; idx < members.length; idx++) {
      // Skip one member's most recent submission so "pending" status shows up
      if (weeksAgo === 0 && idx === 2) continue;

      const member = members[idx];
      const project = projects[idx % projects.length];
      await Report.create({
        userId: member.id,
        weekStart,
        weekEnd,
        projectId: project.id,
        tasksCompleted: `Completed key deliverables for ${project.name} (week of ${weekStart.toDateString()})`,
        tasksPlanned: `Continue ${project.name} work next week`,
        blockers: idx === 0 && weeksAgo === 1 ? "Waiting on API access from client" : "",
        hoursWorked: 35 + idx * 2,
        notes: "",
        status: "submitted",
        submittedAt: weekEnd,
      });
    }
  }

  console.log("Seed complete.");
  console.log("Manager login: manager@demo.com / password123");
  console.log("Member logins: member1@demo.com, member2@demo.com, member3@demo.com / password123");
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
