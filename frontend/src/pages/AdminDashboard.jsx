import React, { useState, useEffect } from 'react';
import { EventAPI } from '../services/api';
import { 
  Plus, Users, DollarSign, AlertTriangle, 
  MapPin, Calendar, Clock, LogOut, LayoutDashboard,
  ShieldAlert, TrendingUp, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { logout, user } = useUser();
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventType: 'Flood',
    affectedLocation: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await EventAPI.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await EventAPI.create(newEvent);
      setShowModal(false);
      fetchEvents();
      setNewEvent({ eventName: '', eventType: 'Flood', affectedLocation: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to create event: " + (err.response?.data?.message || err.response?.data?.error || err.message));
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await EventAPI.updateStatus(id, newStatus);
      fetchEvents();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const statCards = [
    { label: 'Total Funds', value: '$4.2M', icon: DollarSign, color: 'var(--success)', trend: '+12%' },
    { label: 'Active Events', value: events.filter(e => e.eventStatus === 'ACTIVE').length, icon: AlertTriangle, color: 'var(--warning)', trend: 'Ongoing' },
    { label: 'System Users', value: '124', icon: Users, color: 'var(--primary)', trend: '+5 new' },
    { label: 'Relief Projects', value: '18', icon: TrendingUp, color: 'var(--accent)', trend: '85% active' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ShieldAlert size={24} color="#3b82f6" />
          </div>
          <span className="brand-text" style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>ReliefFlow</span>
        </div>

        <nav className="side-nav">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Admin User'}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          <button onClick={logout} className="btn btn-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="content">
        <header className="top-bar">
          <div>
            <h1>Command Center</h1>
            <p className="subtitle">Real-time Relief Monitoring & Management</p>
          </div>
          <div className="top-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              New Campaign
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          {statCards.map((stat, i) => (
            <div key={i} className="card stat-card">
              <div className="stat-header">
                <div className="stat-icon-wrapper" style={{ color: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <span className="stat-label">{stat.label}</span>
              </div>
              <div className="stat-body">
                <h3 className="stat-value">{stat.value}</h3>
                <span className="stat-trend" style={{ color: stat.color }}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Campaigns Table */}
        <section className="main-section">
          <div className="section-header">
            <h2>Disaster Campaigns</h2>
          </div>

          <div className="card table-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? events.map(event => (
                  <tr key={event.id}>
                    <td><div className="event-name-cell">{event.eventName}</div></td>
                    <td><MapPin size={14} /> {event.affectedLocation}</td>
                    <td><span className="badge badge-info">{event.eventType}</span></td>
                    <td>
                      <select 
                        value={event.eventStatus} 
                        onChange={(e) => handleUpdateStatus(event.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="CREATED">Created</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                    <td><Calendar size={14} /> {event.startDate}</td>
                    <td>
                      <button 
                        className="btn btn-ghost btn-sm" 
                        onClick={() => alert(`Event: ${event.eventName}\nLocation: ${event.affectedLocation}\nType: ${event.eventType}\nStatus: ${event.eventStatus}`)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="empty-state">No active campaigns found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content card">
              <div className="modal-header">
                <h3>New Campaign</h3>
                <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleCreateEvent}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Event Name</label>
                    <input type="text" value={newEvent.eventName} onChange={e => setNewEvent({...newEvent, eventName: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Event Type</label>
                    <select value={newEvent.eventType} onChange={e => setNewEvent({...newEvent, eventType: e.target.value})}>
                      <option value="Flood">Flood</option>
                      <option value="Earthquake">Earthquake</option>
                      <option value="Cyclone">Cyclone</option>
                      <option value="Wildfire">Wildfire</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" value={newEvent.affectedLocation} onChange={e => setNewEvent({...newEvent, affectedLocation: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" value={newEvent.startDate} onChange={e => setNewEvent({...newEvent, startDate: e.target.value})} required />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Campaign</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .sidebar { border-right: 1px solid rgba(255,255,255,0.1); }
        .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
        .side-nav { flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; color: #94a3b8; text-decoration: none; border-radius: 8px; }
        .nav-item.active { background: #2563eb; color: white; }
        
        .content { padding: 40px; background: #f1f5f9; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .subtitle { color: #64748b; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
        .stat-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .stat-label { font-size: 14px; font-weight: 500; }
        .stat-value { font-size: 24px; font-weight: 700; margin: 0; }
        .stat-trend { font-size: 12px; font-weight: 600; }

        .table-card { padding: 0; overflow: hidden; }
        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table th { background: #f8fafc; padding: 16px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        .custom-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        
        .status-select { 
          padding: 6px 12px; 
          border-radius: 8px; 
          font-size: 12px; 
          font-weight: 600; 
          background: #ffffff; 
          border: 1px solid #e2e8f0; 
          color: #1e293b; 
          cursor: pointer;
          appearance: auto; /* Use standard browser appearance for stability */
        }
        .status-select option {
          background: #ffffff;
          color: #1e293b;
        }
        .status-select:hover { border-color: #2563eb; }
        
        .btn-logout { width: 100%; background: rgba(239, 68, 68, 0.1); color: #ef4444; margin-top: 16px; }
        .user-avatar { width: 32px; height: 32px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .user-details { margin-left: 12px; }
        .user-name { font-size: 14px; font-weight: 600; margin: 0; }
        .user-role { font-size: 12px; color: #94a3b8; margin: 0; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal-content { width: 500px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
