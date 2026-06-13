import { useState } from "react";
import { createTask } from "../services/api";

export default function TaskForm({ refresh }) {
  const [task, setTask] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(task);
    setTask({ title: "", description: "" });
    refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <button>Add Task</button>
    </form>
  );
}