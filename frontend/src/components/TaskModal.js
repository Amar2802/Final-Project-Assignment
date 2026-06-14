import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TaskModal({ onClose, onSave, taskToEdit }) {
  const [activeTab, setActiveTab] = useState("details");
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

  const [newSubtext, setNewSubtext] = useState("");
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
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required");
      setActiveTab("details");
      return;
    }

    onSave({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim() || "General",
      estimatedHours: Number(formData.estimatedHours) || 0,
      actualHours: Number(formData.actualHours) || 0,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    });
    onClose();
  };

  // Subtask Actions
  const handleToggleSubtask = (index) => {
    const updated = [...formData.subtasks];
    updated[index] = {
      ...updated[index],
      isCompleted: !updated[index].isCompleted
    };
    setFormData({ ...formData, subtasks: updated });
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtext.trim()) return;
    
    const updated = [
      ...formData.subtasks,
      { text: newSubtext.trim(), isCompleted: false }
    ];
    setFormData({ ...formData, subtasks: updated });
    setNewSubtext("");
  };

  const handleDeleteSubtask = (index) => {
    const updated = formData.subtasks.filter((_, i) => i !== index);
    setFormData({ ...formData, subtasks: updated });
  };

  // Reverse timeline order for activities
  const activityList = taskToEdit && taskToEdit.activities
    ? [...taskToEdit.activities].reverse()
    : [];

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        <div className="modal-header">
          <h2>{taskToEdit ? "Edit Task" : "Create Task"}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
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
            Subtasks ({formData.subtasks.length})
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === "activities" ? "active" : ""}`}
            onClick={() => setActiveTab("activities")}
          >
            Activity Log
          </button>
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

        {/* Tab Content: Details */}
        {activeTab === "details" && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="modal-title-field">Title *</label>
              <input
                id="modal-title-field"
                type="text"
                className="glass-input"
                placeholder="e.g. Design Figma Prototype"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-desc-field">Description</label>
              <textarea
                id="modal-desc-field"
                className="glass-input"
                style={{ minHeight: "80px", resize: "vertical" }}
                placeholder="Provide details about this task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-cat-field">Category</label>
                <input
                  id="modal-cat-field"
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Design, Coding"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="modal-due-field">Due Date</label>
                <input
                  id="modal-due-field"
                  type="date"
                  className="glass-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-status-field">Status</label>
                <select
                  id="modal-status-field"
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
                <label htmlFor="modal-priority-field">Priority</label>
                <select
                  id="modal-priority-field"
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

            {/* Time Tracking row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-estimate-field">Estimated Time (Hours)</label>
                <input
                  id="modal-estimate-field"
                  type="number"
                  min="0"
                  step="0.5"
                  className="glass-input"
                  placeholder="e.g. 8"
                  value={formData.estimatedHours || ""}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="modal-actual-field">Actual Logged (Hours)</label>
                <input
                  id="modal-actual-field"
                  type="number"
                  min="0"
                  step="0.5"
                  className="glass-input"
                  placeholder="e.g. 3.5"
                  value={formData.actualHours || ""}
                  onChange={(e) => setFormData({ ...formData, actualHours: Number(e.target.value) })}
                />
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

        {/* Tab Content: Checklist */}
        {activeTab === "checklist" && (
          <div className="checklist-container">
            <div className="checklist-list">
              {formData.subtasks.length > 0 ? (
                formData.subtasks.map((sub, index) => (
                  <motion.div 
                    key={index} 
                    className={`checklist-item ${sub.isCompleted ? "completed" : ""}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <div className="checklist-item-left">
                      <input
                        type="checkbox"
                        className="checklist-checkbox"
                        checked={sub.isCompleted}
                        onChange={() => handleToggleSubtask(index)}
                      />
                      <span className="checklist-text">{sub.text}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-icon delete"
                      style={{ padding: "4px" }}
                      onClick={() => handleDeleteSubtask(index)}
                      title="Delete subtask"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </motion.div>
                ))
              ) : (
                <div style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "20px 0", fontSize: "0.9rem" }}>
                  No subtasks added yet. Add items below to build a checklist.
                </div>
              )}
            </div>

            <form onSubmit={handleAddSubtask} className="checklist-add-form">
              <input
                type="text"
                className="glass-input"
                placeholder="Add checklist item..."
                value={newSubtext}
                onChange={(e) => setNewSubtext(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: "12px 18px" }}>
                Add
              </button>
            </form>

            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSubmit}>
                Save Checklist
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Activity Log */}
        {activeTab === "activities" && (
          <div className="activity-log-container">
            {activityList.length > 0 ? (
              <div className="activity-timeline">
                {activityList.map((act, i) => (
                  <motion.div 
                    key={i} 
                    className="activity-item"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <p className="activity-item-text">{act.text}</p>
                    <span className="activity-item-time">
                      {new Date(act.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "40px 0", fontSize: "0.9rem" }}>
                {taskToEdit 
                  ? "No activities recorded for this task." 
                  : "This is a new task. Activity log will generate once the task is created."}
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: "30px" }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
