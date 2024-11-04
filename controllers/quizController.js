const Quiz = require("../models/Quiz");

const findQuiz = async (quizId) => {
    return await Quiz.findById(quizId);
};

const findQuestion = (quiz, questionIndex) => {
    if (isNaN(questionIndex) || questionIndex < 0 || questionIndex >= quiz.questions.length) {
        throw new Error('Incorrect question index');
    }
    return quiz.questions[questionIndex];
};

const getQuizAttemptedByUser = (user, quizId) => {
    return user.quizzes.find((quiz) => quiz._id == quizId);
};

module.exports = {
    // Views
    indexView: (req, res) => {
        res.render("quizzes/index");
    },
    questionView: (req, res) => {
        res.render("quizzes/question");
    },
    resultsView: (req, res) => {
        res.locals.score = req.session.score;
        res.locals.quiz = req.session.quiz;
        res.render("quizzes/results");
    },

    // CRUD
    create: async (req, res) => {
        const { body } = req;
        try {
            const quiz = await Quiz.create(body);
            res.json(quiz);
        } catch (error) {
            console.log(`Error creating quiz: ${error.message}`);
        }
    },

    getQuiz: async (req, res) => {
        const quizId = req.params.id;
        try {
            const quiz = await findQuiz(quizId);
            res.json(quiz);
        } catch (error) {
            console.log(`Error retrieving quiz: ${error.message}`);
        }
    },

    getQuizzes: async (req, res, next) => {
        try {
            const quizzes = await Quiz.find();
            res.locals.quizzes = quizzes;
            next();
        } catch (error) {
            console.log(`Error retrieving quizzes: ${error.message}`);
            next(error);
        }
    },

    update: async (req, res) => {
        const quizId = req.params.id;
        const { body } = req;
        try {
            await Quiz.findByIdAndUpdate(quizId, { $set: body });
            const quizUpdated = await Quiz.findById(quizId);
            res.json(quizUpdated);
        } catch (error) {
            console.log(`Error updating quiz by id: ${error.message}`);
        }
    },

    delete: async (req, res) => {
        const quizId = req.params.id;
        try {
            const quizDeleted = await Quiz.findByIdAndDelete(quizId);
            res.json(quizDeleted);
        } catch (error) {
            console.log(`Error deleting quiz by id: ${error.message}`);
        }
    },

    // Initialize
    startQuiz: async (req, res, next) => {
        const quizId = req.params.id;
        req.session.score = 0;
        req.session.questionIndex = 0;

        try {
            const quiz = await findQuiz(quizId);
            req.session.quiz = quiz;

            if (res.locals.currentUser) {
                const quizAttempted = getQuizAttemptedByUser(res.locals.currentUser, quizId);
                if (quizAttempted) {
                    req.session.score = quizAttempted.score;
                    req.session.questionIndex = quizAttempted.questionIndex;

                    if (quizAttempted.questionIndex === quiz.questions.length) {
                        res.locals.redirect = `/quizzes/results`;
                        next();
                        return;
                    }
                } else {
                    res.locals.currentUser.quizzes.push(quiz);
                    await res.locals.currentUser.save();
                }
            }

            res.locals.redirect = `/quizzes/${quizId}/question/${req.session.questionIndex}`;
            next();
        } catch (error) {
            console.log(`Error starting quiz: ${error.message}`);
            next(error);
        }
    },

    resetQuiz: async (req, res, next) => {
        const quizId = req.params.id;
        req.session.score = 0;
        req.session.questionIndex = 0;
        const quizAttempted = getQuizAttemptedByUser(res.locals.currentUser, quizId);

        try {
            if (quizAttempted) {
                quizAttempted.score = req.session.score;
                quizAttempted.questionIndex = req.session.questionIndex;
                await res.locals.currentUser.save();
            }
            res.locals.redirect = `/quizzes/${quizId}/start`;
            next();
        } catch (error) {
            console.log(`Error resetting quiz: ${error.message}`);
            next(error);
        }
    },

    getQuestion: async (req, res, next) => {
        const quizId = req.params.id;
        const questionIndex = parseInt(req.params.index);
        try {
            const quiz = await findQuiz(quizId);
            const question = findQuestion(quiz, questionIndex);

            res.locals.quiz = quiz;
            res.locals.question = question;
            res.locals.questionIndex = questionIndex;
            next();
        } catch (error) {
            console.log(`Error retrieving question: ${error.message}`);
            next(error);
        }
    },

    gradeQuestion: async (req, res, next) => {
        const quizId = req.params.id;
        const { userAnswer } = req.body;
        const questionIndex = parseInt(req.params.index);
        const nextQuestionIndex = questionIndex + 1;

        try {
            const quiz = await findQuiz(quizId);
            const question = findQuestion(quiz, questionIndex);

            const isAnswerCorrect = question.correctAnswer === userAnswer;

            if (isAnswerCorrect) {
                req.session.score += 1;
            }

            if (res.locals.currentUser) {
                const quizAttempted = getQuizAttemptedByUser(res.locals.currentUser, quizId);
                quizAttempted.score = req.session.score;
                quizAttempted.questionIndex = nextQuestionIndex;
                await res.locals.currentUser.save();
            }

            res.locals.redirect = nextQuestionIndex < quiz.questions.length
                ? `/quizzes/${quizId}/question/${nextQuestionIndex}`
                : `/quizzes/results`;
            next();
        } catch (error) {
            console.log(`Error grading question: ${error.message}`);
            next(error);
        }
    },

    // Redirect
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
};
