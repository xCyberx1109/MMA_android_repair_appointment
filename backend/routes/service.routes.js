const express = require("express");
const router = express.Router();
const {getAllServices} = require("../controller/service.controller");

router.get("/", getAllServices);

module.exports = router;
