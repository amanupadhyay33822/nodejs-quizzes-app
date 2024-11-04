const express = require("express")
const router = express.Router()

const userRoutes = require("./userRoutes")
const quizRoutes = require("./quizRoutes")
const courseRoutes = require("./courseRoutes")
const homeRoutes = require("./homeRoutes")
const adminRoutes = require("./adminRoutes")

router.use("/users", userRoutes)
router.use("/quizzes", quizRoutes)
router.use("/courses", courseRoutes)
router.use("/", homeRoutes)
router.use("/admin", adminRoutes)

module.exports = router
