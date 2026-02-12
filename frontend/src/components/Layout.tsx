import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <nav
        style={{
          backgroundColor: 'white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          padding: '1rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#2563eb',
              textDecoration: 'none',
            }}
          >
            env-dev
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated && user ? (
              <>
                <span style={{ color: '#6b7280' }}>{user.email}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: '1px solid #d1d5db',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  Login
                </Link>
                <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
};
