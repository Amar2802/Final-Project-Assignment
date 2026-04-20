function TaskList({ tasks, filter, onFilterChange, onToggleStatus, onDeleteTask }) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") {
      return true;
    }

    return task.status === filter;
  });

  if (!tasks.length) {
    return (
      <section className="task-panel">
        <div className="section-heading">
          <h2>All Tasks</h2>
          <span className="task-count">0 tasks</span>
        </div>
        <p className="empty-state">No tasks yet. Add your first task using the form.</p>
      </section>
    );
  }

  return (
    <section className="task-panel">
      <div className="section-heading">
        <h2>All Tasks</h2>
        <span className="task-count">{filteredTasks.length} shown</span>
      </div>

      <div className="filter-tabs" aria-label="Task filters">
        {["All", "Pending", "Completed"].map((status) => (
          <button
            key={status}
            type="button"
            className={filter === status ? "filter-tab active" : "filter-tab"}
            onClick={() => onFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredTasks.length ? (
        <div className="task-list">
          {filteredTasks.map((task) => {
            const nextStatus = task.status === "Completed" ? "Pending" : "Completed";

            return (
              <article className="task-card" key={task._id}>
                <div className="task-card-header">
                  <h3>{task.title}</h3>
                  <span className={`status-badge ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </div>

                <p>{task.description}</p>

                <div className="task-meta">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => onToggleStatus(task._id, nextStatus)}
                  >
                    Mark as {nextStatus}
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => onDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="empty-state">No {filter.toLowerCase()} tasks found.</p>
      )}
    </section>
  );
}

export default TaskList;
