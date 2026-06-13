import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./services/api";
import StatsSection from "./components/StatsSection";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "kanban"
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sortBy: "createdAt:desc"
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const queryParams = {};
      if (filters.search) queryParams.search = filters.search;
      if (filters.status && viewMode === "grid") queryParams.status = filters.status; // Ignore status filter in Kanban
      if (filters.priority) queryParams.priority = filters.priority;
      if (filters.sortBy) queryParams.sortBy = filters.sortBy;

      const res = await getTasks(queryParams);
      if (res.data && res.data.success) {
        setTasks(res.data.data);
      } else {
        setTasks(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  // Fetch tasks when filters or view mode changes
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority, filters.sortBy, viewMode]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 350);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  // Handle Create or Update task
  const handleSaveTask = async (formData) => {
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, formData);
      } else {
        await createTask(formData);
      }
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // Status Checkbox Toggle (Pending -> Completed or Completed -> Pending)
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await updateTask(task._id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task status:", err);
    }
  };

  // Shift Status between columns (Kanban directional arrows)
  const handleShiftStatus = async (task, direction) => {
    const statusFlow = ["Pending", "In Progress", "Completed"];
    let currentIndex = statusFlow.indexOf(task.status);
    
    if (direction === "forward" && currentIndex < 2) {
      currentIndex++;
    } else if (direction === "back" && currentIndex > 0) {
      currentIndex--;
    }
    
    const nextStatus = statusFlow[currentIndex];
    try {
      await updateTask(task._id, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error("Error shifting status:", err);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  // Open modal in create mode
  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal in edit mode
  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
      sortBy: "createdAt:desc"
    });
  };

  // Helper to get tasks by status (for Kanban columns)
  const getTasksByStatus = (statusName) => {
    return tasks.filter((t) => t.status === statusName);
  };

  return (
    <div className="dashboard-container">
      {/* Background Glow effects */}
      <div className="bg-glow-wrapper">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      {/* Top Header */}
      <header className="dashboard-header">
        <div className="logo-section">
          <h1>TaskFlow</h1>
          <p>Manage your projects in a clean, glassmorphic workspace</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {/* View Mode Toggle Controls */}
          <div className="glass-panel" style={{ display: "flex", padding: "4px", borderRadius: "10px" }}>
            <button
              className="btn-secondary"
              style={{
                background: viewMode === "grid" ? "rgba(255,255,255,0.08)" : "transparent",
                borderColor: "transparent",
                padding: "8px 14px",
                fontSize: "0.85rem",
                borderRadius: "8px"
              }}
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </button>
            <button
              className="btn-secondary"
              style={{
                background: viewMode === "kanban" ? "rgba(255,255,255,0.08)" : "transparent",
                borderColor: "transparent",
                padding: "8px 14px",
                fontSize: "0.85rem",
                borderRadius: "8px"
              }}
              onClick={() => setViewMode("kanban")}
            >
              Kanban Board
            </button>
          </div>

          <button className="btn-primary" onClick={handleOpenCreate}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Task
          </button>
        </div>
      </header>

      {/* Statistics Analytics Dashboard */}
      <StatsSection tasks={tasks} />

      {/* Filter and Search Panel */}
      <div className="filters-bar glass-panel">
        <div className="search-box-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="glass-input"
            placeholder="Search tasks by title or content..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-selects">
          {/* Hide Status dropdown if in Kanban view */}
          {viewMode === "grid" && (
            <select
              className="glass-input glass-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}

          <select
            className="glass-input glass-select"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            className="glass-input glass-select"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="dueDate:asc">Due Date (Asc)</option>
            <option value="dueDate:desc">Due Date (Desc)</option>
          </select>

          {(filters.search || (filters.status && viewMode === "grid") || filters.priority || filters.sortBy !== "createdAt:desc") && (
            <button className="btn-secondary" onClick={handleClearFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Task Listing Section */}
      <main>
        {tasks.length > 0 ? (
          viewMode === "grid" ? (
            /* Standard Grid View */
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteTask}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            /* Kanban Board View */
            <div className="kanban-board">
              {/* Column 1: Pending */}
              <div className="kanban-column pending">
                <div className="kanban-column-header">
                  <span className="kanban-column-title">
                    <circle style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#7dd3fc", marginRight: "6px" }}></circle>
                    Pending
                  </span>
                  <span className="kanban-column-count">{getTasksByStatus("Pending").length}</span>
                </div>
                <div className="kanban-cards-list">
                  {getTasksByStatus("Pending").map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteTask}
                      viewMode={viewMode}
                      onShiftStatus={handleShiftStatus}
                    />
                  ))}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="kanban-column in-progress">
                <div className="kanban-column-header">
                  <span className="kanban-column-title">
                    <circle style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#c084fc", marginRight: "6px" }}></circle>
                    In Progress
                  </span>
                  <span className="kanban-column-count">{getTasksByStatus("In Progress").length}</span>
                </div>
                <div className="kanban-cards-list">
                  {getTasksByStatus("In Progress").map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteTask}
                      viewMode={viewMode}
                      onShiftStatus={handleShiftStatus}
                    />
                  ))}
                </div>
              </div>

              {/* Column 3: Completed */}
              <div className="kanban-column completed">
                <div className="kanban-column-header">
                  <span className="kanban-column-title">
                    <circle style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", marginRight: "6px" }}></circle>
                    Completed
                  </span>
                  <span className="kanban-column-count">{getTasksByStatus("Completed").length}</span>
                </div>
                <div className="kanban-cards-list">
                  {getTasksByStatus("Completed").map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteTask}
                      viewMode={viewMode}
                      onShiftStatus={handleShiftStatus}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="empty-state glass-panel">
            <div className="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h3>No Tasks Found</h3>
            <p>We couldn't find any tasks matching your queries. Try creating a new task or resetting the filters.</p>
          </div>
        )}
      </main>

      {/* Add / Edit Task Modal Overlay */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}