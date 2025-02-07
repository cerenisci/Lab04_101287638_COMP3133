// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const app = express();
const port = 8081;

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://cerenisci:<Bihter2021>@cluster0.us9yy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema with validation
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
  },
  city: {
    type: String,
    required: true,
    match: [/^[a-zA-Z ]+$/, "City name must contain only alphabets and spaces"],
  },
  website: {
    type: String,
    required: true,
    match: [/^(https?:\/\/)[a-zA-Z0-9-]+(\.[a-zA-Z]+)+.*$/, "Invalid web URL"],
  },
  zip: {
    type: String,
    required: true,
    match: [/^\d{5}-\d{4}$/, "Invalid ZIP code format"],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d-\d{3}-\d{3}-\d{4}$/, "Invalid phone number format"],
  },
});

const User = mongoose.model("User", userSchema);

// POST API to insert user with validation
app.post(
  "/users",
  [
    check("username").isLength({ min: 4 }).withMessage("Username must be at least 4 characters long"),
    check("email").isEmail().withMessage("Invalid email address"),
    check("city").matches(/^[a-zA-Z ]+$/).withMessage("City name must contain only alphabets and spaces"),
    check("website").matches(/^(https?:\/\/)[a-zA-Z0-9-]+(\.[a-zA-Z]+)+.*$/).withMessage("Invalid web URL"),
    check("zip").matches(/^\d{5}-\d{4}$/).withMessage("Invalid ZIP code format"),
    check("phone").matches(/^\d-\d{3}-\d{3}-\d{4}$/).withMessage("Invalid phone number format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});