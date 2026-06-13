const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Elegant utility wrapper to catch errors from async handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_key_98765", {
    expiresIn: "30d"
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all registration fields (name, email, password)");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User with that email address already exists");
  }

  // Create new user (password is hashed in pre-save hook)
  const user = await User.create({
    name,
    email,
    password
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

// @desc    Authenticate user & get token (login)
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Match password
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
