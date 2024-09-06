const Quiz = require("../models/Quiz")

module.exports = {
        // Views
    indexView: (req, res) => {
        res.render("quizzes/index")
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
            const quiz = await Quiz.findById(quizId);
            res.json(quiz);
        } catch(error) {
            console.log(`Error retreiving quiz ${error.message}`);
        }
    },

    getQuizzes: async (req, res) => {
        try {
            const quizzes = await Quiz.find();
            res.json(quizzes);
        } catch(error) {
            console.log(`Error retreiving quizzes ${error.message}`);
            
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

    //redirect
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
}