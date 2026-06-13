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
      if (filters.status) queryParams.status = filters.status;
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

  // Fetch tasks on initial render and when filters (except search or when in Kanban mode) change
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority, filters.sortBy]);

  // Debounced search trigger (avoids querying MongoDB on every keystroke)
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

  // Cyclic Status Toggle (Pending -> In Progress -> Completed -> Pending)
  const handleToggleStatus = async (task) => {
    const nextStatusMap = {
      "Pending": "In Progress",
      "In Progress": "Completed",
      "Completed": "Pending"
    };
    const nextStatus = nextStatusMap[task.status] || "Pending";
    
    try {
      await updateTask(task._id, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task status:", err);
    }
  };

  // Shift Status Directional (for Kanban board columns)
  const handleMoveStatus = async (task, direction) => {
    const statusOrder = ["Pending", "In Progress", "Completed"];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = currentIndex + direction;
    
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      const nextStatus = statusOrder[nextIndex];
      try {
        await updateTask(task._id, { status: nextStatus });
        fetchTasks();
      } catch (err) {
        console.error("Error shifting task column:", err);
      }
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

  // Group tasks for Kanban columns
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
        
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* View switcher toggle */}
          <div className="view-switcher">
            <button 
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Grid
            </button>
            <button 
              className={`view-btn ${viewMode === "kanban" ? "active" : ""}`}
              onClick={() => setViewMode("kanban")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="3" x2="12" y2="21"></line>
                <line x1="3" y1="3" x2="3" y2="21"></line>
                <line x1="21" y1="3" x2="21" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
              </svg>
              Kanban
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
          {/* Hide Status dropdown filter when in Kanban board since columns sort them natively */}
          {viewMode !== "kanban" && (
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

          {(filters.search || (filters.status && viewMode !== "kanban") || filters.priority || filters.sortBy !== "createdAt:desc") && (
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
            /* Standard Grid Layout */
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            /* Kanban Board Column Layout */
            <div className="kanban-board">
              {["Pending", "In Progress", "Completed"].map((colStatus) => {
                const columnTasks = getTasksByStatus(colStatus);
                return (
                  <div key={colStatus} className="kanban-column">
                    <div className="kanban-column-header">
                      <span className="kanban-column-title">{colStatus}</span>
                      <span className="kanban-column-count">{columnTasks.length}</span>
                    </div>
                    <div className="kanban-tasks-list">
                      {columnTasks.length > 0 ? (
                        columnTasks.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onToggleStatus={handleToggleStatus}
                            onEdit={handleOpenEdit}
                            onDelete={handleDeleteTask}
                            onMoveStatus={handleMoveStatus}
                          />
                        ))
                      ) : (
                        <div style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "30px 10px", border: "1px dashed var(--glass-border)", borderRadius: "8px", background: "rgba(255,255,255,0.01)" }}>
                          No tasks in {colStatus}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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