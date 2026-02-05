import React, { useState } from 'react';
import './LoginForm.css';

interface LoginFormProps {
  onClose?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [step, setStep] = useState<'login' | 'forgot'>('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setMessageType('error');
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://moranik-hub-live.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      setMessageType('success');
      setMessage('Login successful!');
      // Store token and redirect
      localStorage.setItem('token', result.token);
      setTimeout(() => {
        onClose?.();
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setMessageType('error');
      setMessage('Please enter your email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://moranik-hub-live.vercel.app/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Request failed');
      }

      setMessageType('success');
      setMessage('Reset code sent to your email! Check your inbox.');
      setFormData(prev => ({ ...prev, email: '' }));
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.resetCode || !formData.newPassword || !formData.confirmPassword) {
      setMessageType('error');
      setMessage('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://moranik-hub-live.vercel.app/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.resetCode,
          newPassword: formData.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Password reset failed');
      }

      setMessageType('success');
      setMessage('Password reset successful! You can now login.');
      setStep('login');
      setFormData({
        username: '',
        password: '',
        email: '',
        resetCode: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-header">
          <h2>{step === 'login' ? 'Login' : 'Reset Password'}</h2>
          {onClose && (
            <button onClick={onClose} className="close-btn">✕</button>
          )}
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => setStep('forgot')}
              className="forgot-btn"
            >
              Forgot Password?
            </button>
          </form>
        )}

        {step === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="login-form">
            <p className="forgot-subtitle">Enter your email to receive a reset code</p>
            
            <div className="form-group">
              <label htmlFor="forgot-email">Email Address</label>
              <input
                type="email"
                id="forgot-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>

            <div className="form-divider">or</div>

            <div className="form-group">
              <label htmlFor="resetCode">Reset Code</label>
              <input
                type="text"
                id="resetCode"
                name="resetCode"
                value={formData.resetCode}
                onChange={handleChange}
                placeholder="Enter code from email"
              />
            </div>

            {formData.resetCode && (
              <>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="New password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setStep('login');
                setFormData(prev => ({ ...prev, email: '', resetCode: '', newPassword: '', confirmPassword: '' }));
              }}
              className="back-btn"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
