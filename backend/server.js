const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Public routes for user registration & login
app.use("/api/users", require("./routes/userRoutes"));

// Protected task routes (requires valid Bearer JWT token)
app.use("/api/tasks", protect, require("./routes/taskRoutes"));

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(5000, () => console.log("Server running on port 5000"));