const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { body } = require("express-validator");
const validationResult = require("express-validator");

const router = express.Router();

// signup
router.post(
  "/signup",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET_KEY
    );

    res.status(201).json({
      id: user._id,
      email: user.email,
      token: userJwt,
    });
  }
);

// Login
router.post(
  "/login",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").trim().notEmpty().withMessage("Password must be supplied"),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new Error("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET_KEY
    );

    res.status(200).json({
      id: existingUser._id,
      email: existingUser.email,
      token: userJwt,
    });
  }
);

module.exports = router;
