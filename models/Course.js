const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const courseSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String },
    description: { type: String, maxLength: 180, required: true },
    category: { type: String },
    icon: { type: String, required: true },
    quizzes: [{ type: Schema.Types.ObjectId, ref: "Quiz" }]
},
{
    timestamps: true
});

module.exports = model("Course", courseSchema);
