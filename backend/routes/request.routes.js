const express = require("express");

const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getAdminDashboard, getMyRequests,getMyAssignedRequests,createRequest } = require("../controller/request.controller");

router.get("/dashboard", getAdminDashboard);
router.get("/customer/my", auth, getMyRequests);
router.get("/repairman/my", auth, getMyAssignedRequests);
router.post("/create", createRequest);


module.exports = router;
