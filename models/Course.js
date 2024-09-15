const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const courseSchema = new Schema({
    name: { type: String, require: true},
    category: { type: String },
    quizzes: [{ type: Schema.Types.ObjectId, ref: "Quiz"}]
},
{
    timestamps: true
});

module.exports = model("Course", courseSchema);