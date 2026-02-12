import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appApi } from '../services/api';
import { useAppStore, useAuthStore } from '../context/store';
import { Button, Card } from '../components';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const { apps, setApps, addApp, removeApp } = useAppStore();
  const { isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setUser({ id: '', email: '', role: 'user', createdAt: '' });
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, navigate, setUser]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchApps = async () => {
      try {
        const response = await appApi.getApps();
        setApps(response.data.apps);
      } catch (err: unknown) {
        const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
        setError(axiosError.response?.data?.error?.message || 'Failed to load apps');
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [isAuthenticated, setApps]);

  if (!isAuthenticated) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>Welcome to env-dev</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            A local development tool for managing app secrets and configurations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </div>
        </div>
      );
    }
  }

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      const response = await appApi.createApp(newAppName, newAppDescription || undefined);
      addApp(response.data.app);
      setShowCreateModal(false);
      setNewAppName('');
      setNewAppDescription('');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Failed to create app');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;

    try {
      await appApi.deleteApp(id);
      removeApp(id);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      alert(axiosError.response?.data?.error?.message || 'Failed to delete app');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Welcome to env-dev</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          A local development tool for managing app secrets and configurations.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Your Apps</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create App</Button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : apps.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No apps yet</p>
          <Button onClick={() => setShowCreateModal(true)}>Create Your First App</Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {apps.map((app) => (
            <Card key={app.id}>
              <h3 style={{ marginBottom: '0.5rem' }}>{app.name}</h3>
              {app.description && (
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{app.description}</p>
              )}
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                {app._count?.secrets || 0} secrets
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/apps/${app.id}`}>
                  <Button variant="secondary">Manage</Button>
                </Link>
                <Button variant="danger" onClick={() => handleDeleteApp(app.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <Card
            style={{ width: '400px', maxWidth: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1.5rem' }}>Create New App</h2>
            <form onSubmit={handleCreateApp}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Description (optional)
                </label>
                <textarea
                  value={newAppDescription}
                  onChange={(e) => setNewAppDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={creating}>
                  Create
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
