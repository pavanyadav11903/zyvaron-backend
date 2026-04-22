const express = require("express");
const { updateProfile, getDashboardStats } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/stats", getDashboardStats);
router.put("/profile", updateProfile);

module.exports = router;
