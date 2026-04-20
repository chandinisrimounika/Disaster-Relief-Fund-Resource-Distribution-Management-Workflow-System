import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { UserAPI, AuthAPI } from '../services/api';
import { LogIn, User as UserIcon, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [password, setPassword] = useState('password123'); // Default for demo
  const { login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // We can't fetch users before login anymore if all endpoints are protected
    // But for a hackathon demo, we might want to keep the dropdown or just use a text input
    UserAPI.getAll().then(res => setUsers(res.data)).catch(err => {
      // If unauthorized, it's expected if not logged in
      console.log("Fetch users failed (expected if protected)");
      // Fallback: seed some options if needed for the demo
    });
  }, []);

  const handleLogin = async () => {
    const selectedUser = users.find(u => u.id === parseInt(selectedUserId));
    if (!selectedUser) return;

    try {
      const res = await AuthAPI.login({
        email: selectedUser.email,
        password: password
      });
      const userData = {
        id: res.data.userId,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      };
      login(userData, res.data.jwt);
      navigate(`/${res.data.role.toLowerCase()}-dashboard`);
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.error || "Invalid credentials"));
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card login-card"
      >
        <div className="login-header">
          <div className="icon-wrapper">
            <LogIn size={32} color="var(--primary)" />
          </div>
          <h1>Disaster Relief</h1>
          <p>Portal Access</p>
        </div>

        <div className="form-group">
          <label>Select Your Identity</label>
          <div className="select-wrapper">
            <UserIcon className="select-icon" size={18} />
            <select 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Choose a user profile...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="select-wrapper">
            <Lock className="select-icon" size={18} />
            <input 
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
        </div>

        <button 
          className="btn-primary login-btn" 
          onClick={handleLogin}
          disabled={!selectedUserId}
        >
          Access Dashboard
        </button>
      </motion.div>

      <style>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #1e293b, #0f172a);
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .login-header {
          margin-bottom: 32px;
        }
        .icon-wrapper {
          background: rgba(56, 189, 248, 0.1);
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        h1 { 
          margin: 0; 
          font-size: 32px; 
          font-weight: 800; 
          color: #ffffff; 
          text-shadow: 0 0 20px rgba(255,255,255,0.1);
        }
        p { 
          color: #94a3b8; 
          margin-top: 8px; 
          font-weight: 600; 
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 14px;
        }
        .form-group { text-align: left; margin-bottom: 24px; }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: var(--text-secondary); }
        .select-wrapper { position: relative; }
        .select-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); pointer-events: none; }
        select { padding-left: 40px; }
        .login-btn { width: 100%; padding: 12px; margin-top: 8px; }
      `}</style>
    </div>
  );
};

export default Login;
