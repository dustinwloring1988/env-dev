import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { appApi, secretApi } from '../services/api';
import { useAppStore } from '../context/store';
import { Button, Card } from '../components';
import type { Secret } from '../types';

export const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentApp, setCurrentApp, updateApp } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [showAddSecret, setShowAddSecret] = useState(false);
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [creatingSecret, setCreatingSecret] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');
  const [savingSecret, setSavingSecret] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [appRes, secretsRes] = await Promise.all([
          appApi.getApp(id),
          secretApi.getSecrets(id),
        ]);
        setCurrentApp(appRes.data.app);
        setSecrets(secretsRes.data.secrets);
      } catch (err: unknown) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          navigate('/');
        }
        setError('Failed to load app');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setCurrentApp, navigate]);

  const handleAddSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setCreatingSecret(true);
    try {
      const response = await secretApi.createSecret(id, newSecretKey, newSecretValue);
      setSecrets([...secrets, response.data.secret]);
      setShowAddSecret(false);
      setNewSecretKey('');
      setNewSecretValue('');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Failed to add secret');
    } finally {
      setCreatingSecret(false);
    }
  };

  const handleEditSecret = async (secret: Secret) => {
    if (!id) return;

    setEditingSecret(secret);
    setEditKey(secret.key);
    setEditValue('');
  };

  const handleSaveSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !editingSecret) return;

    setSavingSecret(true);
    try {
      const response = await secretApi.updateSecret(id, editingSecret.key, {
        key: editKey,
        value: editValue,
      });
      setSecrets(secrets.map((s) => (s.id === editingSecret.id ? response.data.secret : s)));
      setEditingSecret(null);
      setEditKey('');
      setEditValue('');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Failed to update secret');
    } finally {
      setSavingSecret(false);
    }
  };

  const handleDeleteSecret = async (key: string) => {
    if (!id || !confirm('Are you sure you want to delete this secret?')) return;

    try {
      await secretApi.deleteSecret(id, key);
      setSecrets(secrets.filter((s) => s.key !== key));
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Failed to delete secret');
    }
  };

  const handleRegenerateKey = async () => {
    if (!id || !confirm('Are you sure? Your old API key will stop working.')) return;

    try {
      const response = await appApi.regenerateKey(id);
      updateApp(response.data.app);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Failed to regenerate API key');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!currentApp) {
    return <p>App not found</p>;
  }

  return (
    <div>
      <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Dashboard
      </Link>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{currentApp.name}</h1>
            {currentApp.description && (
              <p style={{ color: '#6b7280' }}>{currentApp.description}</p>
            )}
          </div>
          <Button variant="danger" onClick={handleRegenerateKey}>
            Regenerate API Key
          </Button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
            API Key
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <code
              style={{
                backgroundColor: '#f3f4f6',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontFamily: 'monospace',
                flex: 1,
              }}
            >
              {showApiKey ? currentApp.apiKey : '••••••••••••••••••••••••••••••'}
            </code>
            <Button variant="secondary" onClick={() => setShowApiKey(!showApiKey)}>
              {showApiKey ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Secrets</h2>
          <Button onClick={() => setShowAddSecret(true)}>Add Secret</Button>
        </div>

        {secrets.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No secrets yet. Click "Add Secret" to get started.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 500 }}>Key</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {secrets.map((secret) => (
                <tr key={secret.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem' }}>
                    {editingSecret?.id === secret.id ? (
                      <form onSubmit={handleSaveSecret} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={editKey}
                          onChange={(e) => setEditKey(e.target.value)}
                          style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                        />
                        <input
                          type="password"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="New value"
                          style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                        />
                        <Button type="submit" variant="primary" loading={savingSecret}>Save</Button>
                        <Button type="button" variant="secondary" onClick={() => setEditingSecret(null)}>Cancel</Button>
                      </form>
                    ) : (
                      <code style={{ fontFamily: 'monospace' }}>{secret.key}</code>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Button variant="secondary" onClick={() => handleEditSecret(secret)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteSecret(secret.key)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showAddSecret && (
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
          onClick={() => setShowAddSecret(false)}
        >
          <Card style={{ width: '400px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Secret</h2>
            <form onSubmit={handleAddSecret}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Key</label>
                <input
                  type="text"
                  value={newSecretKey}
                  onChange={(e) => setNewSecretKey(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Value</label>
                <input
                  type="password"
                  value={newSecretValue}
                  onChange={(e) => setNewSecretValue(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Button variant="secondary" type="button" onClick={() => setShowAddSecret(false)}>Cancel</Button>
                <Button type="submit" loading={creatingSecret}>Add</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
