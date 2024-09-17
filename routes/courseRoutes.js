const express = require("express")
const router = express.Router()
const courseController = require("../controllers/courseController")
const quizController = require("../controllers/quizController")

// GET
router.get("/", courseController.getCourses, courseController.indexView)
// get the quizzes for the specified course
router.get("/:id/quizzes", courseController.getCourseQuizzes, quizController.indexView)
router.get("/:id", courseController.getCourse)

// POST
router.post("/", courseController.create)
router.post("/:id/quiz/:quizId", courseController.addQuizzToCourse)

// UPDATE
router.put("/:id", courseController.update)

// DELETE
router.delete("/:id", courseController.delete)

module.exports = router