import React from "react";

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete, viewMode, onShiftStatus }) {
  const { title, description, status, priority, category, dueDate, subtasks, estimatedHours, actualHours } = task;

  // Overdue check
  const isOverdue = (() => {
    if (!dueDate || status === "Completed") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  })();

  const formatLocalDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case "Low": return "badge-low";
      case "High": return "badge-high";
      default: return "badge-medium";
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case "Completed": return "badge-completed";
      case "In Progress": return "badge-progress";
      default: return "badge-pending";
    }
  };

  // Subtasks calculations
  const totalSubtasks = subtasks ? subtasks.length : 0;
  const completedSubtasks = subtasks ? subtasks.filter((s) => s.isCompleted).length : 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Time budget calculation
  const isOverBudget = estimatedHours > 0 && actualHours > estimatedHours;

  return (
    <div className={`task-card glass-panel status-${status.toLowerCase().replace(" ", "-")}`}>
      <div>
        {/* Header: Title & Priority */}
        <div className="task-card-header">
          <h3 className="task-card-title">{title}</h3>
          <span className={`badge ${getPriorityBadgeClass(priority)}`}>
            {priority}
          </span>
        </div>

        {/* Description */}
        <p className="task-card-desc">
          {description || "No description provided."}
        </p>

        {/* Subtask checklist progress bar */}
        {totalSubtasks > 0 && (
          <div className="task-progress-container" title={`${completedSubtasks} of ${totalSubtasks} subtasks completed`}>
            <div className="task-progress-bar">
              <div 
                className="task-progress-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="task-progress-text">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
        )}

        {/* Time Tracking Comparison */}
        {estimatedHours > 0 && (
          <div 
            className={`time-tracking-row ${isOverBudget ? "overdue-budget" : ""}`}
            title={isOverBudget ? "Over estimated budget!" : "Time spent"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>
              {actualHours}h / {estimatedHours}h logged {isOverBudget && "(Over Estimate)"}
            </span>
          </div>
        )}

        {/* Metadata row: Due date & Category */}
        <div className="task-meta-row">
          {category && (
            <span className="task-category-tag">
              {category}
            </span>
          )}
          
          {dueDate && (
            <span className={`task-due-date ${isOverdue ? "overdue" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {isOverdue ? `Overdue: ${formatLocalDate(dueDate)}` : `Due: ${formatLocalDate(dueDate)}`}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Status Actions & Operations */}
      <div className="task-card-footer">
        {/* Toggle status pill, hidden or read-only in Kanban to avoid clutter, but clickable */}
        <button 
          className="task-status-btn"
          onClick={() => onToggleStatus(task)}
          title="Toggle completion status"
        >
          <span className={`badge ${getStatusBadgeClass(status)}`}>
            {status}
          </span>
        </button>

        <div className="task-actions">
          {/* Kanban Shift controls */}
          {viewMode === "kanban" && (
            <div className="kanban-transfer-actions" style={{ marginRight: "8px" }}>
              {status !== "Pending" && (
                <button
                  className="btn-icon"
                  onClick={() => onShiftStatus(task, "back")}
                  title="Move status back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              )}
              {status !== "Completed" && (
                <button
                  className="btn-icon"
                  style={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                  onClick={() => onShiftStatus(task, "forward")}
                  title="Move status forward"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Edit Button */}
          <button 
            className="btn-icon" 
            onClick={() => onEdit(task)}
            title="Edit / View Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          
          {/* Delete Button */}
          <button 
            className="btn-icon delete" 
            onClick={() => onDelete(task._id)}
            title="Delete Task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
