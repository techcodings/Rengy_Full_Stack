import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineUserGroup, HiOutlinePlus, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineTrash } from 'react-icons/hi';
import API from '../api/axios';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState({});
  const [form, setForm] = useState({ name: '', description: '' });
  const [memberForm, setMemberForm] = useState({ userId: '', roleId: '' });
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/teams?limit=50');
      setTeams(data.data.teams || []);
    } catch (err) {
      toast.error('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMembers = async (teamId) => {
    try {
      const { data } = await API.get(`/teams/${teamId}/members`);
      setTeamMembers((prev) => ({ ...prev, [teamId]: data.data || [] }));
    } catch (err) {
      toast.error('Failed to fetch members');
    }
  };

  const fetchUsersAndRoles = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        API.get('/users?limit=100'),
        API.get('/roles'),
      ]);
      setUsers(usersRes.data.data.users || []);
      setRoles(rolesRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post('/teams', form);
      toast.success('Team created!');
      setShowCreateModal(false);
      setForm({ name: '', description: '' });
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post(`/teams/${selectedTeam._id}/add-user`, memberForm);
      toast.success('Member added!');
      setShowAddMemberModal(false);
      setMemberForm({ userId: '', roleId: '' });
      fetchMembers(selectedTeam._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setCreating(false);
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!confirm('Remove this member from the team?')) return;
    try {
      await API.delete(`/teams/${teamId}/remove-user`, { data: { userId } });
      toast.success('Member removed');
      fetchMembers(teamId);
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const toggleExpand = (teamId) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      setExpandedTeam(teamId);
      if (!teamMembers[teamId]) {
        fetchMembers(teamId);
      }
    }
  };

  const openAddMember = (team) => {
    setSelectedTeam(team);
    fetchUsersAndRoles();
    setShowAddMemberModal(true);
  };

  const getRoleBadgeClass = (roleName) => {
    const lower = roleName?.toLowerCase();
    if (lower === 'admin') return 'badge badge-admin';
    if (lower === 'manager') return 'badge badge-manager';
    return 'badge badge-viewer';
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HiOutlineUserGroup size={28} color="#8b5cf6" /> Teams
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Manage teams and members</p>
          </div>
          <button id="create-team-btn" className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <HiOutlinePlus size={18} /> Create Team
          </button>
        </div>
      </motion.div>

      {loading ? <Loader text="Loading teams..." /> : (
        <>
          {teams.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <HiOutlineUserGroup size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>No teams yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {teams.map((team, i) => (
                <motion.div
                  key={team._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card"
                  style={{ overflow: 'hidden' }}
                >
                  {/* Team Header */}
                  <div style={{
                    padding: '20px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer',
                  }} onClick={() => toggleExpand(team._id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: 700, color: '#fff',
                      }}>
                        {team.name?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: '1rem', fontWeight: 700 }}>{team.name}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{team.description || 'No description'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.78rem' }} onClick={(e) => { e.stopPropagation(); openAddMember(team); }}>
                        <HiOutlinePlus size={14} /> Add Member
                      </button>
                      {expandedTeam === team._id ? <HiOutlineChevronUp size={20} color="var(--text-muted)" /> : <HiOutlineChevronDown size={20} color="var(--text-muted)" />}
                    </div>
                  </div>

                  {/* Members Panel */}
                  <AnimatePresence>
                    {expandedTeam === team._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 24px 20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                            Team Members ({teamMembers[team._id]?.length || 0})
                          </p>
                          {!teamMembers[team._id] ? (
                            <Loader size={24} text="Loading members..." />
                          ) : teamMembers[team._id].length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No members yet</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {teamMembers[team._id].map((member) => (
                                <div key={member._id} style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '10px 14px', borderRadius: '10px',
                                  background: 'rgba(255,255,255,0.03)',
                                  border: '1px solid rgba(255,255,255,0.04)',
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                      width: '32px', height: '32px', borderRadius: '8px',
                                      background: 'var(--accent-gradient)',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                                    }}>
                                      {member.userId?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{member.userId?.name}</p>
                                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{member.userId?.email}</p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className={getRoleBadgeClass(member.roleId?.name)}>
                                      {member.roleId?.name}
                                    </span>
                                    <button
                                      onClick={() => handleRemoveMember(team._id, member.userId?._id)}
                                      style={{
                                        background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px',
                                        width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#f87171', transition: 'all 0.2s',
                                      }}
                                    >
                                      <HiOutlineTrash size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Team Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Team">
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Team Name</label>
            <input className="input-field" placeholder="e.g. Engineering" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Description</label>
            <input className="input-field" placeholder="Brief description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary" disabled={creating} style={{ width: '100%', justifyContent: 'center' }}>
            {creating ? 'Creating...' : 'Create Team'}
          </button>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} title={`Add Member to ${selectedTeam?.name}`}>
        <form onSubmit={handleAddMember}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Select User</label>
            <select className="input-field" value={memberForm.userId} onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })} required>
              <option value="">Choose a user...</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Select Role</label>
            <select className="input-field" value={memberForm.roleId} onChange={(e) => setMemberForm({ ...memberForm, roleId: e.target.value })} required>
              <option value="">Choose a role...</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>{r.name} — {r.permissions.join(', ')}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={creating} style={{ width: '100%', justifyContent: 'center' }}>
            {creating ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
