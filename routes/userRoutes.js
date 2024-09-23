const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

// GET
router.get("/signup", userController.signupView)
router.get("/login", userController.loginView)
router.get("/logout", userController.logout, userController.redirectView)
router.get("/:id", userController.getUser, userController.editView)
router.get("/", userController.getUsers, userController.indexView)

// POST
router.post("/login", userController.authenticate)
router.post("/", userController.create, userController.authenticate)

// PUT
router.put("/:id", userController.update, userController.redirectView)

// DELETE
router.delete("/:id", userController.delete, userController.redirectView)

module.exports = router