const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");


router.get("/", userController.getUsers);


router.patch("/:id", userController.updateUser);

router.patch("/:id/toggle-active", userController.toggleActive);

router.patch("/:id/change-password", userController.changePassword);


module.exports = router;
