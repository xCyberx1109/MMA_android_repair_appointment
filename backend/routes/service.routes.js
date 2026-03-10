const express = require("express");
const router = express.Router();
const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require("../controller/service.controller");

router.get("/", getAllServices);

router.get("/:id", getServiceById);

router.post("/", createService);

router.put("/:id", updateService);

router.put("/:id/status", deleteService);
module.exports = router;
