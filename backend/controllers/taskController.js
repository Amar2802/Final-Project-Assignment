const Task = require("../models/Task");

// Elegant utility wrapper to catch errors from async controller handlers and forward them to the error middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all tasks with filtering, sorting and search
// @route   GET /api/tasks
exports.getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, category, sortBy } = req.query;
  const query = {};

  // Text search (matches title or description case-insensitively)
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by priority
  if (priority) {
    query.priority = priority;
  }

  // Filter by category
  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }

  // Sorting setup
  let sortOption = { createdAt: -1 };
  if (sortBy) {
    const parts = sortBy.split(":");
    const field = parts[0];
    const order = parts[1] === "desc" ? -1 : 1;
    sortOption = { [field]: order };
  }

  const tasks = await Task.find(query).sort(sortOption);
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, category, dueDate, estimatedHours, actualHours, subtasks } = req.body;

  // Validation
  if (!title || title.trim() === "") {
    res.status(400);
    throw new Error("Task title is required");
  }

  if (status && !["Pending", "In Progress", "Completed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status type. Must be Pending, In Progress, or Completed");
  }

  if (priority && !["Low", "Medium", "High"].includes(priority)) {
    res.status(400);
    throw new Error("Invalid priority level. Must be Low, Medium, or High");
  }

  if (estimatedHours !== undefined && Number(estimatedHours) < 0) {
    res.status(400);
    throw new Error("Estimated hours cannot be negative");
  }

  if (actualHours !== undefined && Number(actualHours) < 0) {
    res.status(400);
    throw new Error("Actual hours cannot be negative");
  }

  const newTask = await Task.create({
    title: title.trim(),
    description: description ? description.trim() : "",
    status: status || "Pending",
    priority: priority || "Medium",
    category: category ? category.trim() : "General",
    dueDate: dueDate || null,
    estimatedHours: Number(estimatedHours) || 0,
    actualHours: Number(actualHours) || 0,
    subtasks: subtasks || [],
    activities: [{ text: "Task created" }]
  });

  res.status(201).json({
    success: true,
    data: newTask
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = asyncHandler(async (req, res) => {
  const { title, status, priority, estimatedHours, actualHours, subtasks } = req.body;

  // Validation checks
  if (title !== undefined && title.trim() === "") {
    res.status(400);
    throw new Error("Task title cannot be empty");
  }

  if (status && !["Pending", "In Progress", "Completed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status type. Must be Pending, In Progress, or Completed");
  }

  if (priority && !["Low", "Medium", "High"].includes(priority)) {
    res.status(400);
    throw new Error("Invalid priority level. Must be Low, Medium, or High");
  }

  if (estimatedHours !== undefined && Number(estimatedHours) < 0) {
    res.status(400);
    throw new Error("Estimated hours cannot be negative");
  }

  if (actualHours !== undefined && Number(actualHours) < 0) {
    res.status(400);
    throw new Error("Actual hours cannot be negative");
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error(`Task with ID ${req.params.id} not found`);
  }

  // Audit and generate activity logs based on changes
  const newLogs = [];

  if (status && status !== task.status) {
    newLogs.push({ text: `Status updated from '${task.status}' to '${status}'` });
  }

  if (priority && priority !== task.priority) {
    newLogs.push({ text: `Priority changed from '${task.priority}' to '${priority}'` });
  }

  if (estimatedHours !== undefined && Number(estimatedHours) !== task.estimatedHours) {
    newLogs.push({ text: `Estimated time updated to ${estimatedHours} hours` });
  }

  if (actualHours !== undefined && Number(actualHours) !== task.actualHours) {
    const diff = Number(actualHours) - task.actualHours;
    if (diff > 0) {
      newLogs.push({ text: `Logged ${diff} hours of work` });
    } else {
      newLogs.push({ text: `Adjusted logged work to ${actualHours} hours` });
    }
  }

  if (subtasks) {
    // Check for new subtasks, or status changes in existing subtasks
    const oldSubMap = new Map();
    task.subtasks.forEach(s => {
      oldSubMap.set(s._id ? s._id.toString() : s.text, s);
    });

    subtasks.forEach(newSub => {
      const key = newSub._id ? newSub._id.toString() : newSub.text;
      const oldSub = oldSubMap.get(key);
      if (!oldSub) {
        newLogs.push({ text: `Added subtask: '${newSub.text}'` });
      } else if (newSub.isCompleted !== oldSub.isCompleted) {
        newLogs.push({
          text: newSub.isCompleted 
            ? `Completed subtask: '${newSub.text}'` 
            : `Reopened subtask: '${newSub.text}'`
        });
      }
    });

    // Check for deleted subtasks
    const newSubKeys = new Set(subtasks.map(s => s._id ? s._id.toString() : s.text));
    task.subtasks.forEach(oldSub => {
      const key = oldSub._id ? oldSub._id.toString() : oldSub.text;
      if (!newSubKeys.has(key)) {
        newLogs.push({ text: `Deleted subtask: '${oldSub.text}'` });
      }
    });
  }

  // Update properties on the task document
  Object.keys(req.body).forEach(key => {
    if (key !== "activities") { // Prevent direct overriding of activities
      task[key] = req.body[key];
    }
  });

  // Append new logs to activities
  if (newLogs.length > 0) {
    task.activities.push(...newLogs);
  }

  const updatedTask = await task.save();

  res.status(200).json({
    success: true,
    data: updatedTask
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error(`Task with ID ${req.params.id} not found`);
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Task successfully deleted"
  });
});