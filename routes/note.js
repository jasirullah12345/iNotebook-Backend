const express = require("express");
// Routing
const router = express.Router();
// Imported Middlewares
const Userdetails = require("../middlewares/Userdetails");
// Imported Model
const Note = require("../models/Note");
// Request body validation
const {body, validationResult} = require("express-validator");
// MongoDB object validator
const ObjectId = require('mongoose').Types.ObjectId;


// Route 1: Fetch all notes using: GET "/api/note/fetchallnotes" Login required
router.get("/fetchallnotes", Userdetails, async (req, res) => {
    try {
        // Find all notes of this corresponding user
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error."});
    }
})

// Route 2: Create New Note using: POST "/api/note/addnote" Login required
router.post("/addnote", Userdetails, [
    body("title", "Title must be greater than 3 characters.").isLength({min: 3}),
    body("description", "Description must be greater than 3 characters.").isLength({min: 3})
], async (req, res) => {

    // If there is errors, return bad request and errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        // Taking values from Req.body and Create a note
        const {title, description, tag} = req.body;
        const note = await Note.create({
            user: req.user.id,
            title,
            description,
            tag
        })
        res.json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error."});
    }
})


// Route 3: Update an existing note using: PUT "/api/note/updatenote" Login required
router.put("/updatenote/:id", Userdetails, async (req, res) => {
    try {
        // Taking Note id from Req.params
        const noteId = req.params.id;

        // Taking values from Req.body and Create a new note object
        const {title, description, tag} = req.body;
        const newNote = {};
        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }

        // Check note id object is valid (HEX Number)
        if (!ObjectId.isValid(noteId)) {
            console.log("ObjectId not valid");
            return res.status(422).json({error: "Note Id is not valid"});
        }

        // Check the note is exists or not
        let note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({error: "Note not Found."});
        }

        // Check weather the note belongs this user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({error: "Not Allowed."});
        }

        // Update Note
        note = await Note.findByIdAndUpdate(noteId, {$set: newNote}, {new: true})
        res.json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error."});
    }
})

// Route 4: Delete note using: DELETE "/api/note/deletenote" Login required
router.delete("/deletenote/:id", Userdetails, async (req, res) => {
    try {
        // Taking Note id from Req.params
        const noteId = req.params.id;

        // Check note id object is valid (HEX Number)
        if (!ObjectId.isValid(noteId)) {
            console.log("ObjectId not valid");
            return res.status(422).json({error: "Note Id is not valid"});
        }

        // Check the note is exists or not
        let note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({error: "Note not Found."});
        }

        // Check weather the note belongs this user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({error: "Not Allowed."});
        }

        // Delete Note
        note = await Note.findByIdAndDelete(noteId)
        res.json({Success:"Note is deleted Successfully.",note});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error."});
    }
})


module.exports = router
