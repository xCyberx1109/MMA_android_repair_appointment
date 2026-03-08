const express = require("express");

const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getAdminDashboard, createRequest, getMyRequests,getMyAssignedRequests } = require("../controller/RequestController");

router.get("/dashboard", getAdminDashboard);
router.post("/create", createRequest);
router.get("/customer/my", auth, getMyRequests);
router.get("/repairman/my", auth, getMyAssignedRequests);

module.exports = router;
