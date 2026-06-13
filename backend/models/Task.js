const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Subtask description is required"],
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const activitySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  category: {
    type: String,
    trim: true,
    default: "General"
  },
  dueDate: {
    type: Date,
    default: null
  },
  subtasks: {
    type: [subtaskSchema],
    default: []
  },
  estimatedHours: {
    type: Number,
    default: 0,
    min: [0, "Estimated hours cannot be negative"]
  },
  actualHours: {
    type: Number,
    default: 0,
    min: [0, "Actual hours cannot be negative"]
  },
  activities: {
    type: [activitySchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);