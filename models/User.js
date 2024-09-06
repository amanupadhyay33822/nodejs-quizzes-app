const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    username: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
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

// passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
    });

module.exports = model("User", userSchema);
