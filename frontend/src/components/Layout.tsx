import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Layers, LogOut, Menu, User } from 'lucide-react';
import './Layout.css';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (email: string) => {
    if (!email) return 'AD';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="layout-wrapper">
      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 95
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-logo">
          <div className="brand-icon">
            <ShoppingBag size={28} style={{ strokeWidth: 2.5 }} />
          </div>
          <div>
            <h1 className="brand-title">ProfitPulse</h1>
            <p className="brand-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/produtos" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <ShoppingBag size={20} />
            <span>Produtos</span>
          </NavLink>

          <NavLink 
            to="/categorias" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Layers size={20} />
            <span>Categorias</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="main-content">
        <header className="header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          
          <div className="header-title">
            <span>Área Administrativa</span>
          </div>

          <div className="user-profile">
            <div className="user-info">
              <p className="user-name">{user?.email || 'admin@zaffari.com'}</p>
              <p className="user-role">Administrador</p>
            </div>
            <div className="avatar">
              {user ? getInitials(user.email) : <User size={20} />}
            </div>
          </div>
        </header>

        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
