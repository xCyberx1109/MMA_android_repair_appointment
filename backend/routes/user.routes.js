const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");


router.get("/", userController.getUsers);


router.put("/:id", userController.updateUser);

router.patch("/:id/toggle-active", userController.toggleActive);

module.exports = router;
