import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTaskStatus
} from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setError("");
      setIsLoading(true);
      const taskData = await getTasks();
      setTasks(taskData);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (task) => {
    try {
      setError("");
      setIsSubmitting(true);
      const newTask = await createTask(task);
      setTasks((currentTasks) => [newTask, ...currentTasks]);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (taskId, status) => {
    try {
      setError("");
      const updatedTask = await updateTaskStatus(taskId, status);
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError("");
      await deleteTask(taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">MERN CRUD App</p>
          <h1>Task Management System</h1>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="content-grid">
        <section className="form-panel">
          <div className="section-heading">
            <h2>Create Task</h2>
          </div>
          <TaskForm onCreateTask={handleCreateTask} isSubmitting={isSubmitting} />
        </section>

        {isLoading ? (
          <section className="task-panel">
            <div className="section-heading">
              <h2>All Tasks</h2>
            </div>
            <p className="empty-state">Loading tasks...</p>
          </section>
        ) : (
          <TaskList
            tasks={tasks}
            filter={filter}
            onFilterChange={setFilter}
            onToggleStatus={handleToggleStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>
    </main>
  );
}

export default App;
