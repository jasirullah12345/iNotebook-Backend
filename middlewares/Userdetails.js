// Authentication Token after Login or new user created successfully
const jwt = require('jsonwebtoken');
// Include Environmental variables
require("dotenv").config();

// Global Variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const Userdetails = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({error: "Please authenticate using a valid token"});
    }
    try {
        const payLoad = jwt.verify(token,JWT_SECRET_KEY);
        req.user = payLoad.user;
        next();
    } catch (error) {
        return res.status(401).json({error: "Please authenticate using a valid token"});
    }

};
module.exports = Userdetails