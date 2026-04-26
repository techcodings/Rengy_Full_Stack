import { useAuth } from '../../context/AuthContext';
import { HiOutlineUser } from 'react-icons/hi';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header style={{
      height: '64px',
      background: 'rgba(15, 15, 26, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <HiOutlineUser size={18} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.name || 'User'}
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {user?.email || ''}
          </p>
        </div>
      </div>
    </header>
  );
}
