import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { EventAPI, ResourceAPI, DistributionAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import { Truck, Send, ClipboardList, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const FieldOfficerDashboard = () => {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [distributions, setDistributions] = useState([]);
  
  const [formData, setFormData] = useState({
    eventId: '',
    resourceItemId: '',
    distributedQuantity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const eventRes = await EventAPI.getAll(true);
      setEvents(eventRes.data);
      const invRes = await ResourceAPI.getInventory();
      setInventory(invRes.data);
      const distRes = await DistributionAPI.getAll();
      setDistributions(distRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDistribute = async (e) => {
    e.preventDefault();
    try {
      await DistributionAPI.distribute({
        ...formData,
        distributedQuantity: parseInt(formData.distributedQuantity),
        distributedById: user.id
      });
      setFormData({ eventId: '', resourceItemId: '', distributedQuantity: '' });
      fetchData();
      alert("Distribution successful!");
    } catch (err) {
      alert(err.response?.data?.error || "Distribution failed");
    }
  };

  return (
    <Layout title="Field Distribution">
      <div className="grid-main">
        <section className="form-section">
          <h2>New Resource Distribution</h2>
          <div className="glass-card distribution-card">
            <form onSubmit={handleDistribute}>
              <div className="form-group">
                <label>Select Active Event</label>
                <select required value={formData.eventId} onChange={e => setFormData({...formData, eventId: e.target.value})}>
                  <option value="">Choose event...</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.eventName} ({e.affectedLocation})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Resource to Distribute</label>
                <select required value={formData.resourceItemId} onChange={e => setFormData({...formData, resourceItemId: e.target.value})}>
                  <option value="">Choose resource...</option>
                  {inventory.map(inv => (
                    <option key={inv.resourceItem.id} value={inv.resourceItem.id}>
                      {inv.resourceItem.resourceName} (Avail: {inv.availableQuantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input required type="number" value={formData.distributedQuantity} onChange={e => setFormData({...formData, distributedQuantity: e.target.value})} placeholder="Enter quantity..." />
              </div>
              <button type="submit" className="btn-primary distribute-btn">
                <Send size={18} style={{marginRight: '8px'}}/> Confirm Dispatch
              </button>
            </form>
          </div>
        </section>

        <section className="history-section">
          <h2>Recent Dispatches</h2>
          <div className="dispatch-list">
            {distributions.map(dist => (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={dist.id} className="glass-card dispatch-item">
                <div className="dispatch-icon">
                  <Truck size={20} color="var(--primary)" />
                </div>
                <div className="dispatch-details">
                  <h4>{dist.distributedQuantity} {dist.resourceItem.unitType}s of {dist.resourceItem.resourceName}</h4>
                  <p className="event-name">{dist.disasterEvent.eventName}</p>
                  <p className="dispatch-date">{new Date(dist.distributionDate).toLocaleString()}</p>
                </div>
                <div className="dispatch-status">
                  <span className="status-badge status-active">Dispatch</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .grid-main { display: grid; grid-template-columns: 400px 1fr; gap: 40px; }
        .distribution-card { margin-top: 24px; }
        .distribute-btn { width: 100%; padding: 12px; display: flex; align-items: center; justify-content: center; margin-top: 12px; }
        .dispatch-list { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
        .dispatch-item { display: flex; align-items: flex-start; gap: 16px; padding: 16px; }
        .dispatch-icon { background: rgba(56, 189, 248, 0.1); padding: 12px; border-radius: 12px; }
        .dispatch-details h4 { margin: 0 0 4px 0; font-size: 16px; }
        .event-name { font-size: 13px; color: var(--primary); margin: 0 0 2px 0; }
        .dispatch-date { font-size: 12px; color: var(--text-secondary); margin: 0; }
        .dispatch-status { margin-left: auto; }
      `}</style>
    </Layout>
  );
};

export default FieldOfficerDashboard;
