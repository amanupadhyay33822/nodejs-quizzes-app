const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

//GET
router.get("/:id/question/:index", quizController.getQuestion,  quizController.questionView)
router.get("/:id/start", quizController.startQuiz, quizController.redirectView)
router.get("/results", quizController.resultsView)
router.get("/:id", quizController.getQuiz)
router.get("/", quizController.getQuizzes, quizController.indexView)

//POST
router.post("/:id/question/:index/grade", quizController.gradeQuestion, quizController.redirectView)
router.post("/", quizController.create)//, quizController.redirectView)

// //UPDATE
router.put("/:id", quizController.update)//, quizController.redirectView)

// //DELETE
router.delete("/:id", quizController.delete)//, quizController.redirectView)

module.exports = router;