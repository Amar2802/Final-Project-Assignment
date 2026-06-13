const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Utility asyncHandler wrapper for middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from Bearer prefix
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_98765");

      // Find user from decoded payload, exclude password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user profile not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, session token invalid or expired");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no session token provided");
  }
});

module.exports = { protect };
