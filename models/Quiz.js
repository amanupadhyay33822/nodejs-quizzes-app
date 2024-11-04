const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// Define the quiz schema
const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true, // Required field for quiz title
      trim: true, // Trims whitespace from the title
    },
    questions: [
      {
        statement: {
          type: String,
          required: true, // Required field for question statement
          unique: true, // Each question statement must be unique
        },
        options: {
          type: [String], // Array of options for multiple choice questions
          required: true, // Ensure options are provided
        },
        correctAnswer: {
          type: String,
          required: true, // Required field for correct answer
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for admin tracking
   // Ensure a creator is specified
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the Quiz model
module.exports = model("Quiz", quizSchema);
