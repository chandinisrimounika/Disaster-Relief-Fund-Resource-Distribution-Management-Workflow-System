import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogOut, LayoutDashboard, Globe, Users, Package, Truck, Heart } from 'lucide-react';

const Layout = ({ children, title }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: `/${user?.role.toLowerCase()}-dashboard`, icon: <LayoutDashboard size={20}/> },
  ];

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Globe color="var(--primary)" />
            <span>ReliefFlow</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link key={item.name} to={item.path} className="nav-item">
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name.charAt(0)}
            </div>
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>{title}</h1>
        </header>
        <div className="content-body">
          {children}
        </div>
      </main>

      <style>{`
        .layout-container { display: flex; height: 100vh; overflow: hidden; }
        .sidebar { 
          width: 260px; 
          background: var(--surface-color); 
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }
        .sidebar-header { padding: 24px; border-bottom: 1px solid var(--border); }
        .logo { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 20px; }
        .sidebar-nav { flex: 1; padding: 24px 12px; }
        .nav-item { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding: 12px; 
          color: var(--text-secondary); 
          text-decoration: none; 
          border-radius: 8px;
          margin-bottom: 4px;
        }
        .nav-item:hover, .nav-item.active { background: var(--surface-hover); color: var(--text-primary); }
        .sidebar-footer { padding: 24px; border-top: 1px solid var(--border); }
        .user-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .user-avatar { 
          width: 40px; height: 40px; border-radius: 50%; 
          background: var(--primary); color: #000; 
          display: flex; align-items: center; justify-content: center; font-weight: 700;
        }
        .user-name { font-size: 14px; font-weight: 600; margin: 0; }
        .user-role { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; margin: 0; }
        .logout-btn { 
          width: 100%; display: flex; align-items: center; gap: 10px; 
          padding: 10px; color: var(--danger); background: rgba(248, 113, 113, 0.1);
        }
        .logout-btn:hover { background: rgba(248, 113, 113, 0.2); }
        .main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; background: var(--bg-color); }
        .content-header { padding: 24px 40px; border-bottom: 1px solid var(--border); }
        .content-header h1 { font-size: 24px; }
        .content-body { padding: 40px; }
      `}</style>
    </div>
  );
};

export default Layout;
