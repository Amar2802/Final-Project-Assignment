import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
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
      <div className="bg-glow-wrapper">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      <motion.div 
        className="auth-card glass-panel"
        initial={{ scale: 0.92, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <div className="auth-header">
          <motion.h2 
            key={isLogin ? "login-title" : "register-title"}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLogin ? "Welcome back" : "Create Account"}
          </motion.h2>
          <motion.p
            key={isLogin ? "login-desc" : "register-desc"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? "Log in to access your task dashboard" : "Sign up to start organizing your projects"}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="auth-error-box"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-fields" : "register-fields"}
              initial={{ opacity: 0, x: isLogin ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 15 : -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
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
            </motion.div>
          </AnimatePresence>

          <motion.button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", marginTop: "10px" }} 
            disabled={loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" className="auth-toggle-btn" onClick={toggleMode}>
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
