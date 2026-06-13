import React from "react";

export default function StatsSection({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      {/* Total Tasks */}
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper" style={{ color: "#a855f7" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="13" y2="17"></line>
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper" style={{ color: "#38bdf8" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      {/* In Progress Tasks */}
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper" style={{ color: "#c084fc" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value">{inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper" style={{ color: "#34d399" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value">{completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper" style={{ color: "#f472b6" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="16"></line>
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="6" y1="20" x2="6" y2="4"></line>
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-value">{completionRate}%</span>
          <span className="stat-label">Completion Rate</span>
        </div>
      </div>
    </div>
  );
}
