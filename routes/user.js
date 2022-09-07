require("dotenv").config();
const { Router } = require("express");
const router = Router();

const UserController = require("../controller/userController");
const {  isAuthenticated } = require("../middlewares/auth");

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.patch("/:id", isAuthenticated, UserController.editUser);
router.get("/:id", isAuthenticated, UserController.getUser);

module.exports = router;