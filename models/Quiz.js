const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const quizSchema = new Schema({
    title: { type: String, required: true },
    questions: [{
        statement: { type: String, required: true, unique: true },
        options: [String],
        correctAnswer: String
    }]
});

module.exports = model('Quiz', quizSchema);