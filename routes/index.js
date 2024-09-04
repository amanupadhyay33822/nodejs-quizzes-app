const express = require("express")
const router = express.Router()

const userRoutes = require("./userRoutes")
const quizRoutes = require("./quizRoutes")
const homeRoutes = require("./homeRoutes")

router.use("/users", userRoutes)
router.use("/quizzes", quizRoutes)
router.use("/", homeRoutes)

module.exports = router
