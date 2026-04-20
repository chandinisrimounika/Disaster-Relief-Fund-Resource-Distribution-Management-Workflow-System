import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { UserAPI } from '../services/api';
import { LogIn, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    UserAPI.getAll().then(res => setUsers(res.data)).catch(err => console.error(err));
  }, []);

  const handleLogin = () => {
    const user = users.find(u => u.id === parseInt(selectedUserId));
    if (user) {
      login(user);
      navigate(`/${user.role.toLowerCase()}-dashboard`);
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
        h1 { margin: 0; font-size: 24px; color: var(--text-primary); }
        p { color: var(--text-secondary); margin-top: 4px; }
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
