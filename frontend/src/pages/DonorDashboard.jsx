import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { EventAPI, DonationAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import { Heart, History, TrendingUp, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DonorDashboard = () => {
  const { user } = useUser();
  const [activeEvents, setActiveEvents] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const eventRes = await EventAPI.getAll(true);
      setActiveEvents(eventRes.data);
      const historyRes = await DonationAPI.getByDonor(user.id);
      setHistory(historyRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      await DonationAPI.process({
        donorId: user.id,
        eventId: selectedEvent.id,
        donationAmount: parseFloat(amount)
      });
      setSelectedEvent(null);
      setAmount('');
      fetchData();
      alert("Thank you for your contribution!");
    } catch (err) {
      alert(err.response?.data?.error || "Donation failed");
    }
  };

  const totalContributed = history.reduce((acc, curr) => acc + curr.donationAmount, 0);

  return (
    <Layout title="Donor Portal">
      <div className="stats-grid">
        <StatCard icon={<Heart color="#f472b6"/>} label="Total Contributed" value={`$${totalContributed.toLocaleString()}`} />
        <StatCard icon={<History color="var(--primary)"/>} label="Donation Count" value={history.length} />
        <StatCard icon={<TrendingUp color="var(--success)"/>} label="Active Campaigns" value={activeEvents.length} />
      </div>

      <div className="dashboard-sections">
        <section className="events-section">
          <h2>Active Campaigns</h2>
          <div className="events-grid">
            {activeEvents.map(event => (
              <motion.div whileHover={{ y: -4 }} key={event.id} className="glass-card event-mini-card">
                <h3>{event.eventName}</h3>
                <p className="location">{event.affectedLocation}</p>
                <div className="badge-row">
                  <span className="type-badge">{event.eventType}</span>
                </div>
                <button className="btn btn-primary donate-btn" onClick={() => setSelectedEvent(event)}>
                  Contribute Now
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="history-section">
          <h2>Contribution History</h2>
          <div className="glass-card table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td>{item.disasterEvent.eventName}</td>
                    <td className="amount-td">${item.donationAmount.toLocaleString()}</td>
                    <td className="date-td">{new Date(item.donationDate).toLocaleDateString()}</td>
                    <td><span className="status-badge status-active">{item.paymentStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card donation-modal">
              <h2>Donate to {selectedEvent.eventName}</h2>
              <form onSubmit={handleDonate}>
                <div className="form-group">
                  <label>Amount (USD)</label>
                  <div className="amount-input-wrapper">
                    <DollarSign className="input-icon" size={18} />
                    <input autoFocus type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setSelectedEvent(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Confirm Donation</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .dashboard-sections { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
        .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-top: 16px; }
        .event-mini-card { display: flex; flex-direction: column; gap: 12px; }
        .event-mini-card h3 { font-size: 18px; margin: 0; }
        .location { color: var(--text-secondary); font-size: 14px; margin: 0; }
        .type-badge { font-size: 11px; background: rgba(56, 189, 248, 0.1); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-weight: 600; }
        .donate-btn { margin-top: 8px; }
        .amount-td { font-weight: 700; color: var(--success); }
        .date-td { font-size: 13px; color: var(--text-secondary); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .donation-modal { width: 100%; max-width: 400px; }
        .amount-input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }
        .amount-input-wrapper input { padding-left: 40px; font-size: 18px; font-weight: 700; }
      `}</style>
    </Layout>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-card stat-card">
    <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.05)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div className="stat-info" style={{ marginLeft: '20px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>{label}</p>
      <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{value}</h3>
    </div>
  </div>
);

export default DonorDashboard;
