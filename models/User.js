const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, required: true },
    quizzes: [{
        quiz: { type: Schema.Types.ObjectId, ref:"Quiz" },
        score: { type: Number, default: 0 },
        questionIndex: { type: Number, default: 0 },
        attemptDate: { type: Date, default: Date.now }
    }]
},
    { 
        timestamps: true
    }
);

// mongoose hooks
userSchema.pre("save", async function(next) {
    const user = this;

    try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
    } catch (error) {
        console.log(`Error in hashing password: ${error.message}`);
        next(error);
    }
});

// Instance methods
userSchema.methods.passwordComparison = function(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

module.exports = model("User", userSchema);
