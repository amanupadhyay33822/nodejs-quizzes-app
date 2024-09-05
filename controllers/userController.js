const User = require("../models/User")

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

    // CRUD
    create: async (req, res, next) => {
        const { body } = req;
        try {
            await User.create(body);
            res.locals.redirect = "/users";
            next();
        } catch(error) {
            console.log(`Error creating user ${error.message}`);
            next(error);
        }
    },

    getUser: async (req, res, next) => {
        const userId = req.params.id;
        try {
            res.locals.user = await User.findById(userId);
            next();
        } catch(error) {
            console.log(`Error retreiving the user ${error.message}`);
            next(error)
        }
    },

    getUsers: async (req, res, next) => {
        try {
            res.locals.users = await User.find();
            next();
        } catch(error) {
            console.log(`Error in getAllUsers ${error.message}`);
            next(error)
        }
    },

    update: async (req, res, next) => {
        const userId = req.params.id;
        const { body } = req;
        console.log(body);
        
        try {;
            await User.findByIdAndUpdate(userId, { $set: body })
            // necessary for the pre hook "save" to be triggered
            const userUpdated = await User.findById(userId);
            userUpdated.save();

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
    authenticate: async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            console.log(req.body.email);
            console.log(req.body.password);
            
            console.log(user);
            
            if (user) {
                try {
                    const passwordMatch = await user.passwordComparison(req.body.password);
                    if (passwordMatch) {
                        res.locals.redirect = `/`;
                        res.locals.user = user;
                    } else {
                        res.locals.redirect = "/users/login";
                    }
                    next();
                } catch (error) {

                }
            } else {
                res.locals.redirect = "/users/login";
                next();
            }
        } catch(error) {
            console.log(`Error logging in user: ${error.message}`);
            next(error);
        }
    },

    // redirect
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
}