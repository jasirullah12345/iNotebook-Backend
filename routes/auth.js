const express = require("express");
const router = express.Router();

router.get("/signin", (req, res) => {
    let obj = {
        username: "Jasir Ullah Khan"
    };
    res.json(obj);
})
router.get("/signup", (req, res) => {
    res.send("Signup")
})
module.exports = router