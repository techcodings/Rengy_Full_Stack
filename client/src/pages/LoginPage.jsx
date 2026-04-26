import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineLogin } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '20px',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
        top: '-100px',
        right: '-100px',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)',
        bottom: '-50px',
        left: '-50px',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '440px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
            <span className="gradient-text">Team</span>Vault
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Sign in to your account
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  color: '#f87171',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <HiOutlineMail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  placeholder="alice@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-password"
                  type="password"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <HiOutlineLogin size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            background: 'rgba(99, 102, 241, 0.08)',
            borderRadius: '10px',
            border: '1px solid rgba(99, 102, 241, 0.15)',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Demo credentials (after seeding):</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Email:</strong> alice@example.com &nbsp;|&nbsp; <strong>Password:</strong> password123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
