const Quiz = require("../models/Quiz")

const findQuiz = (quizId) => {
    return Quiz.findById(quizId);
};

const findQuestion = (quiz, questionIndex) => {
    if (isNaN(questionIndex) || questionIndex < 0 || questionIndex >= quiz.questions.length) {
        throw new Error('Incorrect question index');
    }
    return question = quiz.questions[questionIndex];
};

const getQuizAttemptedByUser = (user, quizId) => {
    const userQuizzes = user.quizzes;
    return userQuizzes.filter((quiz) => {
        return quiz._id == quizId
    })[0];
};

module.exports = {
    // Views
    indexView: (req, res) => {
        res.render("quizzes/index")
    },
    questionView : (req, res) => {
        res.render("quizzes/question")
    },

    resultsView: (req, res) => {
        res.locals.score = req.session.score;
        res.locals.quizLength = req.session.quizLength
        res.locals.quizId = req.session.quizId;
        res.render("quizzes/results")
    },

    // CRUD
    create : async (req, res) => {
        const { body } = req;
        try {
            const quiz = await Quiz.create(body);
            res.json(quiz);
        } catch(error) {
            console.log(`Error creating quiz ${error.message}`);
        }
    },

    getQuiz: async (req, res) => {
        const quizId = req.params.id;
        try {
            const quiz = findQuiz(quizId);
            res.json(quiz);
        } catch(error) {
            console.log(`Error retreiving quiz Get Quiz ${error.message}`);
        }
    },

    getQuizzes: async (req, res, next) => {
        try {
            const quizzes = await Quiz.find();
            res.locals.quizzes = quizzes;
            next();
        } catch(error) {
            console.log(`Error retreiving quizzes ${error.message}`); 
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
        } catch(error) {
            console.log(`Error updating quiz by id: ${error.message}`);
        }
    },

    delete: async (req, res) => {
        const quizId = req.params.id;
        try {
            const quizDeleted = await Quiz.findByIdAndDelete(quizId);
            res.json(quizDeleted);
        } catch(error) {
            console.log(`Error deleting quiz by id: ${error.message}`);
        }
    },

    //Initialize quiz score
    startQuiz: async (req, res, next) => {
        const quizId = req.params.id;
        req.session.score = 0;
        req.session.questionIndex = 0;
        
        try {
            const quiz = await findQuiz(quizId);
            req.session.quizLength = quiz.questions.length;         
            
            if (res.locals.currentUser) {
                const quizAttempted = getQuizAttemptedByUser(res.locals.currentUser, quizId);

                if (quizAttempted) {
                    req.session.score = quizAttempted.score;
                    req.session.questionIndex = quizAttempted.questionIndex;
                    req.session.quizId = quizId;
                    if (quizAttempted.questionIndex == quiz.questions.length) {
                        res.locals.redirect = `/quizzes/results`;
                        next();
                    }
                } else {
                    res.locals.currentUser.quizzes.push(quiz);
                    res.locals.currentUser.save();
                }   
            }
            
            res.locals.redirect = `/quizzes/${quizId}/question/${req.session.questionIndex}`;
            next();
        } catch(error) {
            console.log(`Error retreiving question Start Quiz ${error.message}`);
            next(error);
        }
    },

    resetQuiz: async (req, res, next) => {
        const quizId = req.params.id;
        req.session.score = 0;
        req.session.questionIndex = 0;
        const quizAttempted = getQuizAttemptedByUser(res.locals.currentUser, quizId);
        try {
            const quiz = await findQuiz(quizId);
            req.session.quizLength = quiz.questions.length;
            if (quizAttempted) {
                quizAttempted.score = req.session.score;
                quizAttempted.questionIndex = req.session.questionIndex;
                res.locals.currentUser.save();
            }
            res.locals.redirect = `/quizzes/${quizId}/start`;
            next();
        } catch(error) {
            console.log(`Error retreiving question Restart Quiz ${error.message}`);
            next(error);
        }
    },

    //Question related controllers
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
        } catch(error) {
            console.log(`Error retreiving question Get Qustion ${error.message}`);
            next(error);
        }
    },

    gradeQuestion: async (req, res, next) => {
        const quizId = req.params.id;
        const { userAnswer } = req.body;
        const questionIndex = parseInt(req.params.index);
        const nextQuestionIndex = ++req.params.index;
        
        try {
            const quiz = await findQuiz(quizId);
            const question = findQuestion(quiz, questionIndex);

            const correctAnswer = question.correctAnswer;

            isCorrect = correctAnswer === userAnswer;
            req.flash("isQuestionCorrect", isCorrect);
            
            if (isCorrect) req.session.score += 1;

            // User LoggedIn
            if (res.locals.currentUser) {
                const quizAttempted = getQuizAttemptedByUser(res.locals.currentUser, quizId);
                quizAttempted.score = req.session.score;
                quizAttempted.questionIndex = nextQuestionIndex;
                res.locals.currentUser.save();
            }

            res.locals.redirect = (nextQuestionIndex == req.session.quizLength) ? "/quizzes/results" : `/quizzes/${quizId}/question/${nextQuestionIndex}`;
            next();
        } catch(error) {
            console.log(`Error retreiving question Grade Qustion ${error.message}`);
            next(error);
        }
    },

    //redirect
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
};