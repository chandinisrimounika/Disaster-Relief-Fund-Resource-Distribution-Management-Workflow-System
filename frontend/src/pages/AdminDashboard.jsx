import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { EventAPI, DonationAPI, AllocationAPI } from '../services/api';
import { Plus, Users, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [stats, setStats] = useState({ totalDonations: 0, activeEvents: 0, users: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const eventRes = await EventAPI.getAll();
      setEvents(eventRes.data);
      
      const donationRes = await DonationAPI.getAll();
      const totalDonations = donationRes.data.reduce((acc, curr) => acc + curr.donationAmount, 0);
      
      setStats({
        totalDonations,
        activeEvents: eventRes.data.filter(e => e.eventStatus === 'ACTIVE').length,
        users: 4 // Sample
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventType: 'Flood',
    affectedLocation: '',
    startDate: '',
    endDate: ''
  });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await EventAPI.create(newEvent);
      setShowEventForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create event");
    }
  };

  const updateEventStatus = async (id, status) => {
    try {
      await EventAPI.updateStatus(id, status);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <Layout title="Admin Command Center">
      <div className="stats-grid">
        <StatCard icon={<DollarSign color="var(--success)"/>} label="Total Funds Collected" value={`$${stats.totalDonations.toLocaleString()}`} />
        <StatCard icon={<Activity color="var(--primary)"/>} label="Active Campaigns" value={stats.activeEvents} />
        <StatCard icon={<Users color="var(--warning)"/>} label="System Users" value={stats.users} />
      </div>

      <div className="section-header">
        <h2>Disaster Campaigns</h2>
        <button className="btn-primary flex-btn" onClick={() => setShowEventForm(true)}>
          <Plus size={18} /> New Campaign
        </button>
      </div>

      {showEventForm && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card mb-24">
          <form onSubmit={handleCreateEvent} className="event-form">
            <div className="grid-2">
              <div className="form-group">
                <label>Event Name</label>
                <input required value={newEvent.eventName} onChange={e => setNewEvent({...newEvent, eventName: e.target.value})} placeholder="e.g. Operation Rain Shadow" />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select value={newEvent.eventType} onChange={e => setNewEvent({...newEvent, eventType: e.target.value})}>
                  <option>Flood</option>
                  <option>Earthquake</option>
                  <option>Cyclone</option>
                  <option>Pandemic</option>
                  <option>Wildfire</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Affected Location</label>
              <input required value={newEvent.affectedLocation} onChange={e => setNewEvent({...newEvent, affectedLocation: e.target.value})} placeholder="Region name..." />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Start Date</label>
                <input required type="date" value={newEvent.startDate} onChange={e => setNewEvent({...newEvent, startDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>End Date (Optional)</label>
                <input type="date" value={newEvent.endDate} onChange={e => setNewEvent({...newEvent, endDate: e.target.value})} />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEventForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Initialize Campaign</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="glass-card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>
                  <div className="td-main">{event.eventName}</div>
                  <div className="td-sub">{event.eventType}</div>
                </td>
                <td>{event.affectedLocation}</td>
                <td>
                  <span className={`status-badge status-${event.eventStatus.toLowerCase()}`}>
                    {event.eventStatus}
                  </span>
                </td>
                <td>
                  <select 
                    className="action-select"
                    value={event.eventStatus}
                    onChange={(e) => updateEventStatus(event.id, e.target.value)}
                  >
                    <option value="CREATED">CREATED</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .stat-card { display: flex; align-items: center; gap: 20px; }
        .stat-icon { width: 56px; height: 56px; border-radius: 12px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; }
        .stat-info p { color: var(--text-secondary); font-size: 14px; margin-bottom: 4px; }
        .stat-info h3 { font-size: 24px; font-weight: 700; margin: 0; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .flex-btn { display: flex; align-items: center; gap: 8px; }
        .mb-24 { margin-bottom: 24px; }
        .event-form { display: flex; flex-direction: column; gap: 20px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
        .btn-secondary { background: transparent; border: 1px solid var(--border); color: var(--text-primary); padding: 10px 20px; }
        .table-card { padding: 0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 24px; background: rgba(255,255,255,0.02); color: var(--text-secondary); font-size: 13px; font-weight: 600; text-transform: uppercase; }
        .data-table td { padding: 16px 24px; border-bottom: 1px solid var(--border); }
        .td-main { font-weight: 600; margin-bottom: 2px; }
        .td-sub { font-size: 12px; color: var(--text-secondary); }
        .action-select { width: auto; font-size: 12px; padding: 4px 8px; }
      `}</style>
    </Layout>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-card stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
