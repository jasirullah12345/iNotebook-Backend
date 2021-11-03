const express = require("express");
// Routing
const router = express.Router();
// Request body validations
const {body, validationResult} = require('express-validator');
// Password Hashing with salt
const bcrypt = require('bcryptjs');
// Authentication Token after Login or new user created successfully
const jwt = require('jsonwebtoken');
// Imported Schemas
const User = require("../models/User");
// Imported Middlewares
const Userdetails = require("../middlewares/Userdetails");
// Include Environmental variables
require("dotenv").config();

// Global Variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


// Route 1: Create a user using: POST "/api/auth/createuser" No Login required
router.post("/createuser", [
    body("userName", "Username is must greater than 3 characters.").isLength({min: 3}),
    body("email", "Enter a valid email.").isEmail(),
    body("password", "Password length is must greater than 8 characters.").isLength({min: 8})
], async (req, res) => {

    // If there is errors, return bad request and errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        // Check weather the user with email is already exists
        let user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).json({error: "Sorry the user with this email is already exists."})
        }

        // Password Hashing with Salt
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // Create new user in database
        user = await User.create({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
        });

        // Creating JWT token for authentication after login or create new user successfully
        const payLoad = {
            user: {
                id: user.id
            }
        }
        const authenticationToken = jwt.sign(payLoad, JWT_SECRET_KEY);

        // Send response
        res.json({authenticationToken});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error."});
    }
})


// Route 2: Authenticate a user using: POST "/api/auth/login" No Login required
router.post("/login", [
    body("email", "Enter a valid email.").isEmail(),
    body("password", "Password is not empty.").exists()
], async (req, res) => {

    // If there is errors, return bad request and errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        // Check weather the user with email is exists
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).json({error: "Wrong Credentials please enter valid values."})
        }

        const {email,password} = req.body;

        // Password Hashing Verify
        const passwordMatched = bcrypt.compareSync(password,user.password)
        if(!passwordMatched){
            return res.status(400).json({error: "Wrong Credentials please enter valid values."})
        }

        // Creating JWT token for authentication after login or create new user successfully
        const payLoad = {
            user: {
                id: user.id
            }
        }
        const authenticationToken = jwt.sign(payLoad, JWT_SECRET_KEY);

        // Send response
        res.json({authenticationToken});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error."});
    }
})


// Route 3: Get logged in user details using: POST "/api/auth/getuser" Login required
router.post("/getuser", Userdetails, async (req, res) => {
    try {
        const userId  = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error."});
    }
})



module.exports = router