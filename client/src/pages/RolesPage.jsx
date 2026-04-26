import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlinePlus } from 'react-icons/hi';
import API from '../api/axios';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const permissionColors = {
  CREATE_TASK: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' },
  EDIT_TASK: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
  DELETE_TASK: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' },
  VIEW_ONLY: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
};

const defaultPermColor = { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', border: 'rgba(99,102,241,0.25)' };

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', permissions: [] });
  const [creating, setCreating] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        API.get('/roles'),
        API.get('/permissions/constants'),
      ]);
      setRoles(rolesRes.data.data || []);
      setAvailablePermissions(permsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const togglePermission = (permId) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId],
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (form.permissions.length === 0) {
      toast.error('Select at least one permission');
      return;
    }
    setCreating(true);
    try {
      await API.post('/roles', form);
      toast.success('Role created!');
      setShowModal(false);
      setForm({ name: '', description: '', permissions: [] });
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create role');
    } finally {
      setCreating(false);
    }
  };

  const getRoleBadgeClass = (roleName) => {
    const lower = roleName?.toLowerCase();
    if (lower === 'admin') return 'badge badge-admin';
    if (lower === 'manager') return 'badge badge-manager';
    return 'badge badge-viewer';
  };

  // Extract permission name from populated permission object or raw string
  const getPermName = (perm) => (typeof perm === 'object' ? perm.name : perm);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HiOutlineShieldCheck size={28} color="#10b981" /> Roles
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Define roles with permissions</p>
          </div>
          <button id="create-role-btn" className="btn-primary" onClick={() => setShowModal(true)}>
            <HiOutlinePlus size={18} /> Create Role
          </button>
        </div>
      </motion.div>

      {loading ? <Loader text="Loading roles..." /> : (
        <>
          {roles.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <HiOutlineShieldCheck size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>No roles defined yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {roles.map((role, i) => (
                <motion.div
                  key={role._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card"
                  style={{ padding: '24px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: role.name.toLowerCase() === 'admin' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                                   role.name.toLowerCase() === 'manager' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                   'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <HiOutlineShieldCheck size={22} color="#fff" />
                      </div>
                      <div>
                        <p style={{ fontSize: '1rem', fontWeight: 700 }}>{role.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{role.description || 'No description'}</p>
                      </div>
                    </div>
                    <span className={getRoleBadgeClass(role.name)}>{role.name}</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Permissions</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {role.permissions.map((perm) => {
                        const name = getPermName(perm);
                        const colors = permissionColors[name] || defaultPermColor;
                        return (
                          <span key={perm._id || name} style={{
                            display: 'inline-flex', alignItems: 'center',
                            padding: '4px 12px', borderRadius: '20px',
                            fontSize: '0.72rem', fontWeight: 600,
                            background: colors.bg, color: colors.color,
                            border: `1px solid ${colors.border}`,
                          }}>
                            {name.replace(/_/g, ' ')}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Role Modal — now fetches permissions from API */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Role">
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Role Name</label>
            <input className="input-field" placeholder="e.g. Editor" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Description</label>
            <input className="input-field" placeholder="Brief description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Permissions <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({form.permissions.length} selected)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {availablePermissions.map((perm) => {
                const isSelected = form.permissions.includes(perm._id);
                const colors = permissionColors[perm.name] || defaultPermColor;
                return (
                  <button
                    key={perm._id}
                    type="button"
                    onClick={() => togglePermission(perm._id)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1px solid ${isSelected ? colors.border : 'var(--border-color)'}`,
                      background: isSelected ? colors.bg : 'rgba(255,255,255,0.02)',
                      color: isSelected ? colors.color : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                  >
                    {perm.name.replace(/_/g, ' ')}
                    {perm.description && (
                      <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 400, marginTop: '2px', opacity: 0.7 }}>
                        {perm.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={creating} style={{ width: '100%', justifyContent: 'center' }}>
            {creating ? 'Creating...' : 'Create Role'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
