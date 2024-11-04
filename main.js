require("dotenv").config();
const express = require("express");
const layouts = require("express-ejs-layouts");
const router = require("./routes/index");
const path = require("path");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const passport = require("passport");
const User = require("./models/User");
const db = require("./config/db");
const Quiz = require("./models/Quiz");

const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;

// Set up passport to serialize and deserialize user data to pass into session
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

db();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", path.join(__dirname, "views/layouts/main.ejs"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(layouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

app.use(cookieParser(sessionSecret));
app.use(expressSession({
    secret: sessionSecret,
    cookie: {
        maxAge: 4000000
        },
    resave: false,
    saveUninitialized: false
}));
app.use(connectFlash());

app.use(passport.initialize());
// passport using `express-session`
app.use(passport.session());

/* Custom Middleware
- Associate connectFlash to flasses on response
- Check if a user is loggedin, and assign that user to currentUser
*/
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;  
    next();
});

app.use(router);
app.post("/add/qs", async(req, res) => {
    // Log the form data to the console
  
    try {
        const { text, type, mcq, options, trueFalseAnswer, descriptive } = req.body.question;
        const quizId = "6724a76440acea6f692226a8"; // Assuming quiz ID is passed to identify the specific quiz
    
        if (!quizId) {
          return res.status(400).send("Quiz ID is required");
        }
    
        // Find the quiz by ID
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
          return res.status(404).send("Quiz not found");
        }
    
        // Prepare question data
        const questionData = {
          statement: text,
        };
    
        // Handle Multiple Choice questions
        if (type === "1") { // 1 = Multiple Choice
          if (!mcq || !options || options.length < 2) {
            return res.status(400).send("Multiple choice questions require a correct answer and at least two options");
          }
          questionData.options = options;
          questionData.correctAnswer = mcq;
    
        // Handle True/False questions
        } else if (type === "2") { // 2 = True/False
          if (!trueFalseAnswer) {
            return res.status(400).send("True/False questions require a correct answer");
          }
          questionData.options = ["True", "False"];
          questionData.correctAnswer = trueFalseAnswer;
    
        // Handle Descriptive questions
        } else if (type === "3") { // 3 = Descriptive
          if (!descriptive) {
            return res.status(400).send("Descriptive questions require an answer");
          }
          questionData.correctAnswer = descriptive;
        } else {
          return res.status(400).send("Invalid question type");
        }
    
        // Add question to quiz and save
        quiz.questions.push(questionData);
        await quiz.save();
    
        res.status(200).send("Question added successfully!");
    
      } catch (error) {
        alert(error.message);
        console.error("Error adding question:", error);
        res.status(500).send("Error adding question");
      }
    // Render the home/index page or send a response
    res.render("home/index");
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port} `)
});