const mongoose = require("mongoose")
const User = require("../models/User")

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connection Successful")
    } catch(error) {
        console.error(`DB Connection: ${error.message}`);
    }
};

module.exports = dbConnection;