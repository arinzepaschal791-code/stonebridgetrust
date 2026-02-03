import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './VerifyEmail.css';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const res = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        if (refreshUser) {
          refreshUser();
        }
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to verify email. Please try again.');
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-card">
        {status === 'loading' && (
          <React.Fragment>
            <div className="spinner"></div>
            <h1>Verifying your email...</h1>
            <p>Please wait while we confirm your email address.</p>
          </React.Fragment>
        )}

        {status === 'success' && (
          <React.Fragment>
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <h1>Email Verified!</h1>
            <p>{message}</p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </React.Fragment>
        )}

        {status === 'error' && (
          <React.Fragment>
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <Link to="/login" className="btn btn-primary">
              Back to Login
            </Link>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
