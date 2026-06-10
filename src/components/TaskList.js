import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../services/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleStatus = async (task) => {
    await updateTask(task._id, {
      status: task.status === "Pending" ? "Completed" : "Pending"
    });
    fetchTasks();
  };

  return (
    <div>
      {tasks.map((t) => (
        <div key={t._id}>
          <h3>{t.title}</h3>
          <p>{t.description}</p>
          <p>{t.status}</p>

          <button onClick={() => toggleStatus(t)}>Toggle</button>
          <button onClick={() => deleteTask(t._id).then(fetchTasks)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}