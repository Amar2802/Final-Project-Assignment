import React, { useState, useEffect } from "react";

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    category: "General",
    dueDate: ""
  });
  
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
          : ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        category: "General",
        dueDate: ""
      });
    }
    setError("");
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

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
      >
        <div className="modal-header">
          <h2>{taskToEdit ? "Edit Task" : "Create Task"}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
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

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="modal-title-input">Title *</label>
            <input
              id="modal-title-input"
              type="text"
              className="glass-input"
              placeholder="e.g. Design Figma Prototype"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="modal-desc-input">Description</label>
            <textarea
              id="modal-desc-input"
              className="glass-input"
              style={{ minHeight: "100px", resize: "vertical" }}
              placeholder="Provide a detailed description of the task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Row for Category & Due Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-cat-input">Category</label>
              <input
                id="modal-cat-input"
                type="text"
                className="glass-input"
                placeholder="e.g. Design, Coding"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal-due-input">Due Date</label>
              <input
                id="modal-due-input"
                type="date"
                className="glass-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          {/* Row for Status & Priority */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-status-select">Status</label>
              <select
                id="modal-status-select"
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
              <label htmlFor="modal-priority-select">Priority</label>
              <select
                id="modal-priority-select"
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

          {/* Modal Footer Actions */}
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {taskToEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
