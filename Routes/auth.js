const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../Config/db");
const userSchema = require("../Models/User");

// @route   POST api/auth
// @desc    Authenticate user using email and password
// @access  Public
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  userSchema.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        { id: user._id },
        jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          res.cookie('token', token, { httpOnly: true, maxAge: 900000, sameSite: 'strict' });

          res.json({
            token,
            user: {
              id: user._id,              
              email: user.email,
            },
          });
        }
      );
    });
  });
});

module.exports = router;
