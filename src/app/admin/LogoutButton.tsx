'use client';

import { useState } from 'react';
import { performLogout } from '@/lib/logout-client';

export default function LogoutButton() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setError('');
    setLoading(true);
    const result = await performLogout();
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <style>{`
        .logout-btn {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 8px 16px;
          min-height: 44px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .logout-btn:hover:not(:disabled) {
          color: #b91c1c;
          border-color: #fecaca;
          background: #fff1f2;
        }
        .logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .logout-error {
          font-size: 12px;
          color: #b91c1c;
          margin-top: 4px;
          max-width: 200px;
          text-align: right;
        }
        .logout-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .logout-dialog-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .logout-dialog {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px 24px;
          width: min(380px, calc(100vw - 32px));
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .logout-dialog-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 24px;
        }
        .logout-dialog-cancel {
          padding: 10px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          cursor: pointer;
        }
        .logout-dialog-confirm {
          padding: 10px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #e11d48;
          cursor: pointer;
        }
        .logout-dialog-cancel:disabled,
        .logout-dialog-confirm:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      <div className="logout-wrap">
        <button
          className="logout-btn"
          onClick={() => {
            setError('');
            setShowConfirm(true);
          }}
          disabled={loading}
          type="button"
        >
          Log out
        </button>
        {error ? (
          <p className="logout-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {showConfirm ? (
        <div
          className="logout-dialog-backdrop"
          role="presentation"
          onClick={() => {
            if (!loading) setShowConfirm(false);
          }}
        >
          <div
            className="logout-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="logout-dialog-title" style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Log out?
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Are you sure you want to log out of the admin portal?
            </p>
            <div className="logout-dialog-actions">
              <button
                type="button"
                className="logout-dialog-confirm"
                onClick={() => void handleLogout()}
                disabled={loading}
              >
                {loading ? 'Logging out…' : 'Yes, log out'}
              </button>
              <button
                type="button"
                className="logout-dialog-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
