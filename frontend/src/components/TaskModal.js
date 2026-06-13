import React, { useState, useEffect } from "react";

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    category: "General",
    dueDate: "",
    estimatedHours: 0,
    actualHours: 0,
    subtasks: []
  });

  const [activeTab, setActiveTab] = useState("details");
  const [hoursToLog, setHoursToLog] = useState("");
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        status: taskToEdit.status || "Pending",
        priority: taskToEdit.priority || "Medium",
        category: taskToEdit.category || "General",
        dueDate: taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
          : "",
        estimatedHours: taskToEdit.estimatedHours || 0,
        actualHours: taskToEdit.actualHours || 0,
        subtasks: taskToEdit.subtasks || []
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        category: "General",
        dueDate: "",
        estimatedHours: 0,
        actualHours: 0,
        subtasks: []
      });
    }
    setError("");
    setActiveTab("details");
    setHoursToLog("");
    setNewSubtaskText("");
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleLogWork = () => {
    const hours = parseFloat(hoursToLog);
    if (isNaN(hours) || hours <= 0) {
      setError("Please enter a valid number of hours to log.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      actualHours: prev.actualHours + hours
    }));
    setHoursToLog("");
    setError("");
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { text: newSubtaskText.trim(), isCompleted: false }]
    }));
    setNewSubtaskText("");
  };

  const handleToggleSubtask = (index) => {
    const updated = [...formData.subtasks];
    updated[index].isCompleted = !updated[index].isCompleted;
    setFormData({ ...formData, subtasks: updated });
  };

  const handleDeleteSubtask = (index) => {
    const updated = formData.subtasks.filter((_, idx) => idx !== index);
    setFormData({ ...formData, subtasks: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    onSave({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim() || "General",
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        <div className="modal-header">
          <h2>{taskToEdit ? "Edit Task" : "Create Task"}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Tab switcher buttons */}
        <div className="modal-tabs">
          <button 
            type="button"
            className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === "checklist" ? "active" : ""}`}
            onClick={() => setActiveTab("checklist")}
          >
            Checklist ({formData.subtasks.length})
          </button>
          {taskToEdit && (
            <button 
              type="button"
              className={`tab-btn ${activeTab === "activities" ? "active" : ""}`}
              onClick={() => setActiveTab("activities")}
            >
              Activity History
            </button>
          )}
        </div>

        {error && (
          <div 
            style={{ 
              background: "rgba(244, 63, 94, 0.15)", 
              color: "#fca5a5", 
              padding: "10px 14px", 
              borderRadius: "8px", 
              marginBottom: "16px",
              fontSize: "0.9rem",
              border: "1px solid rgba(244, 63, 94, 0.2)"
            }}
          >
            {error}
          </div>
        )}

        {/* TAB 1: DETAILS */}
        {activeTab === "details" && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="modal-title">Title *</label>
              <input
                id="modal-title"
                type="text"
                className="glass-input"
                placeholder="e.g. Set up auth routes"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-description">Description</label>
              <textarea
                id="modal-description"
                className="glass-input"
                style={{ minHeight: "80px", resize: "vertical" }}
                placeholder="Provide a detailed description of the task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-category">Category</label>
                <input
                  id="modal-category"
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Design, Frontend"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="modal-duedate">Due Date</label>
                <input
                  id="modal-duedate"
                  type="date"
                  className="glass-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-status">Status</label>
                <select
                  id="modal-status"
                  className="glass-input glass-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="modal-priority">Priority</label>
                <select
                  id="modal-priority"
                  className="glass-input glass-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Time budget */}
            <div className="form-row" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "15px", marginTop: "15px" }}>
              <div className="form-group">
                <label htmlFor="modal-esthours">Estimated Hours</label>
                <input
                  id="modal-esthours"
                  type="number"
                  step="0.5"
                  className="glass-input"
                  placeholder="e.g. 8"
                  value={formData.estimatedHours || ""}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Logged Hours</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Log hrs"
                    className="glass-input"
                    value={hoursToLog}
                    onChange={(e) => setHoursToLog(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={handleLogWork}
                    style={{ padding: "10px 14px", whiteSpace: "nowrap" }}
                  >
                    Log
                  </button>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  Currently logged: <strong>{formData.actualHours} hrs</strong>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {taskToEdit ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CHECKLIST */}
        {activeTab === "checklist" && (
          <div>
            <form onSubmit={handleAddSubtask} className="subtask-form-row">
              <input
                type="text"
                className="glass-input"
                placeholder="Add checklist subtask..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: "12px 18px" }}>
                Add
              </button>
            </form>

            <div className="subtask-list">
              {formData.subtasks.length > 0 ? (
                formData.subtasks.map((sub, idx) => (
                  <div key={idx} className={`subtask-item ${sub.isCompleted ? "completed" : ""}`}>
                    <div className="subtask-item-left">
                      <div 
                        className="subtask-checkbox"
                        onClick={() => handleToggleSubtask(idx)}
                      >
                        {sub.isCompleted && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <span className="subtask-item-text" onClick={() => handleToggleSubtask(idx)} style={{ cursor: "pointer" }}>
                        {sub.text}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      className="btn-icon delete" 
                      onClick={() => handleDeleteSubtask(idx)}
                      title="Remove subtask"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "20px" }}>
                  No subtasks added yet. Add items above to build a checklist.
                </p>
              )}
            </div>

            <div className="modal-actions" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "20px" }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSubmit}>
                Save Task
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITY LOG */}
        {activeTab === "activities" && taskToEdit && (
          <div>
            <div className="activity-list">
              {taskToEdit.activities && taskToEdit.activities.length > 0 ? (
                taskToEdit.activities.slice().reverse().map((act, idx) => (
                  <div key={idx} className="activity-item">
                    <span className="activity-text">{act.text}</span>
                    <span className="activity-time">
                      {new Date(act.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "20px" }}>
                  No activities recorded for this task.
                </p>
              )}
            </div>

            <div className="modal-actions" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "20px" }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
