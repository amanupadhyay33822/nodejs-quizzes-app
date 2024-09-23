const User = require("../models/User");
const passport = require("passport");

module.exports = {
    // Views
    indexView: (req, res) => {
        res.render("users/index");
    },
    editView: (req, res) => {
        res.render("users/editForm");
    },
    signupView: (req, res) => {
        res.render("users/signup");
    },
    loginView: (req, res) => {
        res.render("users/login");
    },

    // Actions
    logout: (req, res, next) => {
        // removes the user property from the session.
        req.logout((error) => {
            if (error) {
                console.log(`Error logging out the user ${error.message}`);
                next(error);
            } else {
                req.flash("success", "You have been logged out!");
                res.locals.redirect = "/";
                next();
            }
        });
    },

    // CRUD
    create: (req, res, next) => {
        const { body } = req;
            const newUser = new User({ username: body.username, email: body.email });
            User.register(newUser, body.password, (error, user) => {
                if (user) {
                    req.flash("success", `${user.username}'s account created successfully!`);
                    next();
                } else {
                    req.flash("error", `Failed to create user account because: ${error.message}.`);
                    res.redirect("/users/signup");
                }
            });
    },

    getUser: async (req, res, next) => {
        const userId = req.params.id;
        try {
            res.locals.user = await User.findById(userId);
            next();
        } catch(error) {
            console.log(`Error retreiving the user ${error.message}`);
            next(error);
        }
    },

    getUsers: async (req, res, next) => {
        try {
            res.locals.users = await User.find();
            next();
        } catch(error) {
            console.log(`Error in getAllUsers ${error.message}`);
            next(error);
        }
    },

    update: async (req, res, next) => {
        const userId = req.params.id;
        const { body } = req;
       
        try {;
            await User.findByIdAndUpdate(userId, { $set: body })
            res.locals.redirect = "/users";
            next();
        } catch(error) {
            console.log(`Error updating user by id: ${error.message}`);
            next(error);
        }
    },

    delete: async (req, res, next) => {
        const userId = req.params.id;
        try {
            await User.findByIdAndDelete(userId);
            res.locals.redirect = "/users";
            next();
        } catch(error) {
            console.log(`Error deleting user by id: ${error.message}`);
            next(error);
        }
    },

    // user authentication -Log In
    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Logged in!"
    }),

    // redirect
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
}