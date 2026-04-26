import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineKey,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { path: '/users', icon: HiOutlineUsers, label: 'Users' },
  { path: '/teams', icon: HiOutlineUserGroup, label: 'Teams' },
  { path: '/roles', icon: HiOutlineShieldCheck, label: 'Roles' },
  { path: '/permissions', icon: HiOutlineKey, label: 'Permissions' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        width: '260px',
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '28px 24px',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.5px',
        }}>
          <span className="gradient-text">Team</span>
          <span style={{ color: 'var(--text-primary)' }}>Vault</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
          Role-Based Access Control
        </p>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '4px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#fff' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-gradient)' : 'transparent',
              transition: 'all 0.2s ease',
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            width: '100%',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
        >
          <HiOutlineLogout size={20} />
          Logout
        </button>
      </div>
    </motion.aside>
  );
}
