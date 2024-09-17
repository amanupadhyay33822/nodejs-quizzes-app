const Course = require("../models/Course");
const Quiz = require("../models/Quiz");

module.exports = {
    // Views
    indexView: (req, res) => {
        res.render("courses/index")
    },

    // CRUD
    create : async (req, res) => {
        const { body } = req;
        try {
            const course = await Course.create(body);
            res.json(course);
        } catch(error) {
            console.log(`Error creating course ${error.message}`);
        }
    },

    getCourse: async (req, res) => {
        const courseId = req.params.id;
        try {
            const course = await Course.findById(courseId);
            res.json(course);
        } catch(error) {
            console.log(`Error retreiving course Get Course ${error.message}`);
        }
    },

    getCourses: async (req, res, next) => {
        try {
            const courses = await Course.find();
            res.locals.courses = courses;
            next();
        } catch(error) {
            console.log(`Error retreiving courses ${error.message}`); 
            next(error);
        }
    },

    update: async (req, res) => {
        const courseId = req.params.id;
        const { body } = req;
        try {
            await Course.findByIdAndUpdate(courseId, { $set: body });
            const courseUpdated = await Course.findById(courseId);
            res.json(courseUpdated);
        } catch(error) {
            console.log(`Error updating course by id: ${error.message}`);
        }
    },

    delete: async (req, res) => {
        const courseId = req.params.id;
        try {
            const courseDeleted = await Course.findByIdAndDelete(courseId);
            res.json(courseDeleted);
        } catch(error) {
            console.log(`Error deleting course by id: ${error.message}`);
        }
    },

    // ------------------------------------------------
    getCourseQuizzes: async (req, res, next) => {
        const courseId = req.params.id;
        try {
            const course = await Course.findById(courseId).populate("quizzes");
            res.locals.quizzes = course.quizzes;
            res.locals.redirect = "quizzes/index";
            next();
        } catch(error) {
            console.log(`Error retreiving course's quizzes: ${error.message}`);
        }
    },

    addQuizzToCourse: async (req, res, next) => {
        const courseId = req.params.id;
        const quizId = req.params.quizId;
        console.log(quizId);
        
        try {
            const quiz = await Quiz.findById(quizId);
            const course = await Course.findById(courseId);
            course.quizzes.push(quiz);
            course.save();
            res.json(course);
        } catch(error) {
            console.log(`Error adding quiz: ${error.message}`);
        }
    },

    //redirect
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
};