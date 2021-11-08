// Authentication Token after Login or new user created successfully
const jwt = require('jsonwebtoken');
// User Model
const User = require("../models/User");
// Include Environmental variables
require("dotenv").config();

// Global Variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const Userdetails = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({error: "Please authenticate using a valid token"});
    }
    try {
        const payLoad = jwt.verify(token, JWT_SECRET_KEY);
        req.user = payLoad.user;
        const user = await User.findById(req.user.id);
        if (user) {
            next();
        } else {
            return res.status(401).json({error: "Unauthorized Access"});
        }
    } catch (error) {
        return res.status(401).json({error: "Please authenticate using a valid token"});
    }

};
module.exports = Userdetails