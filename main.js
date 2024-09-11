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

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port} `)
});