import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineKey, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineShieldCheck } from 'react-icons/hi';
import API from '../api/axios';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const permissionMeta = {
  CREATE_TASK: {
    icon: '➕',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  EDIT_TASK: {
    icon: '✏️',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  DELETE_TASK: {
    icon: '🗑️',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  VIEW_ONLY: {
    icon: '👁️',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
};

const defaultMeta = {
  icon: '🔐',
  gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
};

export default function PermissionsPage() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, teamsRes, permsRes] = await Promise.all([
          API.get('/users?limit=100'),
          API.get('/teams?limit=100'),
          API.get('/permissions/constants'),
        ]);
        setUsers(usersRes.data.data.users || []);
        setTeams(teamsRes.data.data.teams || []);
        setAllPermissions(permsRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser && selectedTeam) {
      resolvePermissions();
    } else {
      setResult(null);
    }
  }, [selectedUser, selectedTeam]);

  const resolvePermissions = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/permissions', {
        params: { userId: selectedUser, teamId: selectedTeam },
      });
      setResult(data.data);
    } catch (err) {
      toast.error('Failed to resolve permissions');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Loader text="Loading..." />;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <HiOutlineKey size={28} color="#f59e0b" /> Permission Resolver
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '32px' }}>
          Select a user and team to view their effective permissions
        </p>
      </motion.div>

      {/* Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
        style={{ padding: '24px', marginBottom: '28px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              👤 Select User
            </label>
            <select
              id="permission-user-select"
              className="input-field"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Choose a user...</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              👥 Select Team
            </label>
            <select
              id="permission-team-select"
              className="input-field"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Choose a team...</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader text="Resolving permissions..." />
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Role info */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
              {result.hasAccess ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'rgba(16,185,129,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <HiOutlineShieldCheck size={28} color="#10b981" />
                  </div>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 700 }}>
                      {result.user?.name}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> is </span>
                      <span style={{ color: '#10b981' }}>{result.role?.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> in </span>
                      <span style={{ color: '#8b5cf6' }}>{result.team?.name}</span>
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {result.permissions.length} permission{result.permissions.length !== 1 ? 's' : ''} granted
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'rgba(239,68,68,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <HiOutlineXCircle size={28} color="#ef4444" />
                  </div>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171' }}>No Access</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      This user has no role assigned in this team
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Permission Cards — driven by API data, not hardcoded */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {allPermissions.map((perm, i) => {
                const meta = permissionMeta[perm.name] || defaultMeta;
                const hasPermission = result.permissions.includes(perm.name);
                return (
                  <motion.div
                    key={perm._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card"
                    style={{
                      padding: '24px',
                      opacity: hasPermission ? 1 : 0.45,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Top accent bar */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                      background: hasPermission ? meta.gradient : 'var(--border-color)',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{meta.icon}</span>
                      {hasPermission ? (
                        <HiOutlineCheckCircle size={22} color="#10b981" />
                      ) : (
                        <HiOutlineXCircle size={22} color="#ef4444" />
                      )}
                    </div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
                      {perm.name.replace(/_/g, ' ')}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {perm.description || perm.name}
                    </p>
                    <div style={{ marginTop: '12px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: '12px',
                        fontSize: '0.7rem', fontWeight: 600,
                        background: hasPermission ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: hasPermission ? '#10b981' : '#ef4444',
                      }}>
                        {hasPermission ? 'GRANTED' : 'DENIED'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          !selectedUser || !selectedTeam ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <HiOutlineKey size={56} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>
                  Select a user and team
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Choose both a user and a team above to resolve permissions
                </p>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
}
