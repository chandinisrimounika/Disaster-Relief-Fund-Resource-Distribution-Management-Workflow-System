import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`toast-item toast-${toast.type}`}
            >
              <div className="toast-icon">
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'error' && <XCircle size={20} />}
                {toast.type === 'warning' && <AlertTriangle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
              </div>
              <div className="toast-message">{toast.message}</div>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }
        .toast-item {
          pointer-events: auto;
          min-width: 300px;
          max-width: 450px;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
        }
        .toast-success { background: rgba(16, 185, 129, 0.9); }
        .toast-error { background: rgba(239, 68, 68, 0.9); }
        .toast-warning { background: rgba(245, 158, 11, 0.9); }
        .toast-info { background: rgba(37, 99, 235, 0.9); }
        
        .toast-icon { display: flex; align-items: center; justify-content: center; opacity: 0.9; }
        .toast-message { flex: 1; font-size: 14px; font-weight: 500; }
        .toast-close { 
          background: transparent; 
          border: none; 
          color: white; 
          opacity: 0.6; 
          cursor: pointer; 
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }
        .toast-close:hover { opacity: 1; }
      `}</style>
    </ToastContext.Provider>
  );
};
