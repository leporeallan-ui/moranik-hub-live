import React, { useState } from 'react';
import './AdminLoginForm.css';

interface AdminLoginFormProps {
  onClose?: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setMessageType('error');
      setMessage('Please enter admin username and password');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://192.168.100.179:5000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Admin login failed');
      }

      setMessageType('success');
      setMessage('Admin login successful!');
      
      // Store admin token
      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminUser', result.admin.username);

      setTimeout(() => {
        onLoginSuccess?.();
        onClose?.();
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>🔐 Admin Access</h2>
          {onClose && (
            <button onClick={onClose} className="close-btn">✕</button>
          )}
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="admin-username">Admin Username</label>
            <input
              type="text"
              id="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Admin Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Authenticating...' : 'Access Management Portal'}
          </button>
        </form>

        <div className="admin-info">
          <p className="security-note">
            ⚠️ This is a restricted admin area. Only authorized administrators have access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
