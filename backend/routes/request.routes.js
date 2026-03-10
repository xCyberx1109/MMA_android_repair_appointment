const express = require("express");

const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getAdminDashboard,
    getMyRequests,
    getMyAssignedRequests,
    createRequest,
    getAvailableRepairmen,
    assignRepairman,
    updateRequestStatus,
    updateRequest
} = require("../controller/request.controller");

router.get("/dashboard", getAdminDashboard);
router.get("/customer/my", auth, getMyRequests);
router.get("/repairman/my", auth, getMyAssignedRequests);
router.post("/create", createRequest);
router.get("/repairman/available", getAvailableRepairmen);
router.put("/:id/assign", assignRepairman);
router.put("/:id/status", updateRequestStatus);
router.put("/:id", auth, updateRequest);


module.exports = router;
