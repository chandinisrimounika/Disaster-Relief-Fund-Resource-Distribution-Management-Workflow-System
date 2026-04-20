import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ResourceAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import { Package, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const CoordinatorDashboard = () => {
  const { user } = useUser();
  const [inventory, setInventory] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const invRes = await ResourceAPI.getInventory();
      setInventory(invRes.data);
      const itemsRes = await ResourceAPI.getAllItems();
      setItems(itemsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await ResourceAPI.updateInventory(selectedItem, parseInt(quantity), user.id);
      setQuantity('');
      fetchData();
      alert("Inventory updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  const getStockStatus = (qty) => {
    if (qty <= 0) return { label: 'Out of Stock', class: 'status-danger' };
    if (qty < 50) return { label: 'Low Stock', class: 'status-warning' };
    return { label: 'Available', class: 'status-active' };
  };

  return (
    <Layout title="Logistics & Inventory">
      <div className="grid-main">
        <section className="inventory-section">
          <div className="section-header">
            <h2>Resource Availability</h2>
            <button className="btn-icon" onClick={fetchData}><RefreshCcw size={18}/></button>
          </div>
          <div className="glass-card table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(inv => {
                  const status = getStockStatus(inv.availableQuantity);
                  return (
                    <tr key={inv.id}>
                      <td><div className="td-main">{inv.resourceItem.resourceName}</div></td>
                      <td>{inv.resourceItem.unitType}</td>
                      <td><div className="td-qty">{inv.availableQuantity}</div></td>
                      <td><span className={`status-badge ${status.class}`}>{status.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="update-section">
          <h2>Update Stock</h2>
          <div className="glass-card update-card">
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Select Resource</label>
                <select required value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                  <option value="">Choose item...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.resourceName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>New Available Quantity</label>
                <input required type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" />
              </div>
              <button type="submit" className="btn-primary update-btn">
                <RefreshCcw size={18} style={{marginRight: '8px'}}/> Sync Inventory
              </button>
            </form>
            <div className="info-box">
              <AlertCircle size={16} />
              <p>Updates will be logged under your coordinator profile for audit purposes.</p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .grid-main { display: grid; grid-template-columns: 1fr 360px; gap: 40px; }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .btn-icon { background: none; color: var(--text-secondary); padding: 8px; }
        .btn-icon:hover { color: var(--primary); }
        .td-qty { font-family: monospace; font-size: 16px; font-weight: 700; }
        .update-card { display: flex; flex-direction: column; gap: 24px; margin-top: 24px; }
        .update-btn { width: 100%; padding: 12px; display: flex; align-items: center; justify-content: center; }
        .info-box { display: flex; gap: 12px; padding: 16px; background: rgba(56, 189, 248, 0.05); border-radius: 8px; color: var(--text-secondary); font-size: 13px; margin-top: 10px; }
      `}</style>
    </Layout>
  );
};

export default CoordinatorDashboard;
