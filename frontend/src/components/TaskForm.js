import { useState } from "react";

const initialFormState = {
  title: "",
  description: ""
};

function TaskForm({ onCreateTask, isSubmitting }) {
  const [formData, setFormData] = useState(initialFormState);
  const [validationError, setValidationError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setValidationError("Please enter both title and description.");
      return;
    }

    setValidationError("");
    await onCreateTask(formData);
    setFormData(initialFormState);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          maxLength="80"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="4"
          maxLength="500"
        />
      </div>

      {validationError && <p className="form-error">{validationError}</p>}

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
