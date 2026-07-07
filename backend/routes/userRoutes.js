const express = require("express");
const { User } = require("../models");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/users - manager only, list team members for filter dropdowns
router.get("/", protect, requireRole("manager"), async (req, res) => {
  const users = await User.findAll({
    where: { role: "member" },
    attributes: ["id", "name", "email", "role", "createdAt"],
  });
  res.json(users);
});

module.exports = router;
