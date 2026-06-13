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
    query.category = { $regex: `^${category}$`, $options: "i" }; // Case insensitive category match
  }

  // Sorting setup
  let sortOption = { createdAt: -1 }; // Default: newest first
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
  const { title, description, status, priority, category, dueDate, estimatedHours, subtasks } = req.body;

  // Manual Validation for professional error responses
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

  const newTask = new Task({
    title: title.trim(),
    description: description ? description.trim() : "",
    status: status || "Pending",
    priority: priority || "Medium",
    category: category ? category.trim() : "General",
    dueDate: dueDate || null,
    estimatedHours: Number(estimatedHours) || 0,
    actualHours: 0,
    subtasks: subtasks || [],
    activities: [{ text: "Task created" }]
  });

  await newTask.save();

  res.status(201).json({
    success: true,
    data: newTask
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = asyncHandler(async (req, res) => {
  const { title, status, priority, actualHours, subtasks } = req.body;

  // Validation
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

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error(`Task with ID ${req.params.id} not found`);
  }

  // Dynamic Activity Logging
  const logs = [];
  if (status && status !== task.status) {
    logs.push(`Status updated to: ${status}`);
  }
  if (actualHours !== undefined && Number(actualHours) !== task.actualHours) {
    const diff = Number(actualHours) - task.actualHours;
    logs.push(`Logged ${diff > 0 ? "+" : ""}${diff.toFixed(1)} hours (Total: ${Number(actualHours)} hrs)`);
  }
  if (title && title.trim() !== task.title) {
    logs.push(`Title changed to: "${title.trim()}"`);
  }
  if (subtasks) {
    const oldSubtasks = task.subtasks || [];
    const newSubtasks = subtasks || [];
    
    if (newSubtasks.length > oldSubtasks.length) {
      const added = newSubtasks[newSubtasks.length - 1];
      logs.push(`Added subtask: "${added.text}"`);
    } else if (newSubtasks.length < oldSubtasks.length) {
      logs.push(`Removed a subtask`);
    } else {
      // Check for checked/unchecked items
      for (let i = 0; i < newSubtasks.length; i++) {
        const matchedOld = oldSubtasks.find(
          (o) => o.text === newSubtasks[i].text || (o._id && newSubtasks[i]._id && o._id.toString() === newSubtasks[i]._id.toString())
        );
        if (matchedOld && matchedOld.isCompleted !== newSubtasks[i].isCompleted) {
          logs.push(`Subtask "${newSubtasks[i].text}" marked ${newSubtasks[i].isCompleted ? "Completed" : "Pending"}`);
        }
      }
    }
  }

  // Append logs to task activities
  if (logs.length > 0) {
    if (!task.activities) task.activities = [];
    logs.forEach((logText) => {
      task.activities.push({ text: logText });
    });
  }

  // Update properties if provided in body
  if (req.body.title !== undefined) task.title = req.body.title.trim();
  if (req.body.description !== undefined) task.description = req.body.description.trim();
  if (req.body.status !== undefined) task.status = req.body.status;
  if (req.body.priority !== undefined) task.priority = req.body.priority;
  if (req.body.category !== undefined) task.category = req.body.category.trim();
  if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
  if (req.body.subtasks !== undefined) task.subtasks = req.body.subtasks;
  if (req.body.estimatedHours !== undefined) task.estimatedHours = Number(req.body.estimatedHours);
  if (req.body.actualHours !== undefined) task.actualHours = Number(req.body.actualHours);

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