import React, { useEffect, useState } from 'react';
import './EmailVerification.css';

export const EmailVerification: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const email = params.get('email');

      if (!code || !email) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: decodeURIComponent(email), code }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Verification failed');
        }

        setStatus('success');
        setMessage('Email verified successfully! You can now login.');
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="verification-page">
      <div className="verification-container">
        {status === 'loading' && (
          <>
            <div className="spinner"></div>
            <p>Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>Verification Successful!</h2>
            <p>{message}</p>
            <p className="redirect-text">Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <a href="/" className="back-link">Back to Home</a>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
