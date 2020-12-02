const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const userSchema = require('../Models/User');
const jwt = require("jsonwebtoken");
const jwtSecret = require("../Config/db");
const auth = require("../Middleware/auth");

//Get all users
router.get('/', auth, (req, res) => {
    userSchema.find({}, (err, results) => {
        if(err){
            res.status(500).send('Something broke!')
            console.log("Error retrieving post")
        } else {
            res.status(200).json(results)
        }
    })
});

//Get Single user
router.get('/:userId', auth, (req, res) => { //needs work
    const _id = req.params.userId;

    userSchema.findById({_id}, (err, results) => {
        if(err){
            res.status(500).send("Invalid post ID")
            console.log("Invalid user ID")
        } else {
            if(results != null){
                res.status(200).json(results)
            } else {
                res.status(400).send('Unknown request')
                console.log('User not found, UserID: ' + _id)
            }
        }
    })
})

//Create user
router.post('/', (req, res) => {
    const { email } = req.body;

    // Check for existing user    
    userSchema.findOne({ email }).then((user) => {
        if (user) return res.status(400).json({ msg: "User already exists" });

        const newUser = new userSchema({
            _id: new mongoose.Types.ObjectId,
            firstName: req.body.firstName,            
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        // Create salt & hash password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;

                // Save user
                newUser.save().then((user) => {
                    jwt.sign(
                        { id: user._id },
                        jwtSecret,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;

                            res.status(200).json({
                                token,
                                user: {
                                    id: user._id,
                                    email: user.email,
                                },
                            });
                        }
                    );
                })
                .catch(err => {
                    res.status(500).send("Unable to save user", err)
                });
            });
        });
    });
});

//Delete user
router.delete('/:userId', auth, (req, res) => {
    const _id = req.params.userId;

    userSchema.findByIdAndDelete({_id}, (err) => {
        if(err){
            res.status(500).send("Error deleting user")
            console.log("Error deleting user")
        } else {
            res.status(204).send()
        }
    })
});

//Update user
router.put('/:userId', auth, async (req, res) => {
    const _id = req.params.userId;
    const body = req.body;
 
    const updateUser = await userSchema.findByIdAndUpdate({_id: _id}, {$set: body}, {new: true, useFindAndModify: false}, function (err, results){
        if(err){
            res.status(500).send('Something went wrong, please try again')
        } else (
            res.status(200).send("User successfully updated, ID: " + _id)
        )
    })
 })

module.exports = router