const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

// Define the user schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true, // Required field for username
    },
    phoneNumber: {
      type: String, // Optional phone number field
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true, // Required and unique email field
    },
    password: {
      type: String,
      required: true, // Required password field
    },
    isAdmin: {
      type: Boolean,
      default: false, // Admin field, defaults to false
    },
    quizzes: [
      {
        quiz: { type: Schema.Types.ObjectId, ref: "Quiz" }, // Reference to Quiz model
        score: { type: Number, default: 0 }, // Default score is 0
        questionIndex: { type: Number, default: 0 }, // Default question index is 0
        attemptDate: { type: Date, default: Date.now }, // Date of the quiz attempt
      },
    ],
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Use passport-local-mongoose plugin for authentication
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Use email as the username field
});

// Export the User model
module.exports = model("User", userSchema);
