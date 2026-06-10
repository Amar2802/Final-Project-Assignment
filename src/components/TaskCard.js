import React from "react";

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const { title, description, status, priority, category, dueDate } = task;

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

  return (
    <div className={`task-card glass-panel status-${status.toLowerCase().replace(" ", "-")}`}>
      <div>
        {/* Header containing Title & Priority */}
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

        {/* Metadata row (Due date, Category) */}
        <div className="task-meta-row">
          {category && (
            <span className="task-category-tag">
              {category}
            </span>
          )}
          
          {dueDate && (
            <span className={`task-due-date ${isOverdue ? "overdue" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Footer containing Status Toggle & Actions */}
      <div className="task-card-footer">
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
          {/* Edit Button */}
          <button 
            className="btn-icon" 
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
