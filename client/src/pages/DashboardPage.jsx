import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUsers, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineLink } from 'react-icons/hi';
import API from '../api/axios';
import Loader from '../components/ui/Loader';

const statCards = [
  { key: 'users', label: 'Total Users', icon: HiOutlineUsers, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { key: 'teams', label: 'Total Teams', icon: HiOutlineUserGroup, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  { key: 'roles', label: 'Available Roles', icon: HiOutlineShieldCheck, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { key: 'memberships', label: 'Active Memberships', icon: HiOutlineLink, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, teams: 0, roles: 0, memberships: 0 });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTeams, setRecentTeams] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, teamsRes, rolesRes] = await Promise.all([
          API.get('/users?limit=5'),
          API.get('/teams?limit=5'),
          API.get('/roles'),
        ]);

        setStats({
          users: usersRes.data.data?.pagination?.total || 0,
          teams: teamsRes.data.data?.pagination?.total || 0,
          roles: Array.isArray(rolesRes.data.data) ? rolesRes.data.data.length : 0,
          memberships: '—',
        });

        setRecentUsers(usersRes.data.data?.users || []);
        setRecentTeams(teamsRes.data.data?.teams || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '32px' }}>
          Overview of your team management system
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card"
            style={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '12px',
                background: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <card.icon size={24} color={card.color} />
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{stats[card.key]}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Data */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
          style={{ padding: '24px' }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineUsers size={20} color="var(--accent-primary)" />
            Recent Users
          </h3>
          {recentUsers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No users yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentUsers.map((user) => (
                <div key={user._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '10px',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
          style={{ padding: '24px' }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineUserGroup size={20} color="#8b5cf6" />
            Recent Teams
          </h3>
          {recentTeams.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No teams yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentTeams.map((team) => (
                <div key={team._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {team.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{team.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{team.description || 'No description'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
