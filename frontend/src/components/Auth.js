import React, { useState } from "react";
import { loginUser, registerUser } from "../services/api";

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    // Basic Validations
    if (!email.trim() || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!isLogin && !name.trim()) {
      setError("Please fill in your name");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await loginUser({ email: email.trim(), password });
      } else {
        res = await registerUser({ name: name.trim(), email: email.trim(), password });
      }

      if (res.data && res.data.success) {
        // Save token & user to localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Notify App parent
        onAuthSuccess(res.data.user);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.response?.data?.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Background glow effects duplicated for isolated auth screen */}
      <div className="bg-glow-wrapper">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome back" : "Create Account"}</h2>
          <p>{isLogin ? "Log in to access your task dashboard" : "Sign up to start organizing your projects"}</p>
        </div>

        {error && (
          <div className="auth-error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name Field (Register Mode Only) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                className="glass-input"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              className="glass-input"
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              className="glass-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Confirm Password Field (Register Mode Only) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-confirm">Confirm Password</label>
              <input
                id="auth-confirm"
                type="password"
                className="glass-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" className="auth-toggle-btn" onClick={toggleMode}>
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
