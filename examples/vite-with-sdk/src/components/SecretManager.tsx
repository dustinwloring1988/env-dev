import { useState } from 'react';
import { useEnvDev } from '../hooks/useEnvDev';
import type { Secret } from 'env-dev-sdk';

export function SecretManager() {
  const {
    app,
    secrets,
    decryptedSecrets,
    loading,
    error,
    fetchDecryptedSecrets,
    createSecret,
    updateSecret,
    deleteSecret,
  } = useEnvDev();

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showDecrypted, setShowDecrypted] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    await createSecret(newKey.trim(), newValue.trim());
    setNewKey('');
    setNewValue('');
  };

  const handleUpdate = async (key: string) => {
    if (!editValue.trim()) return;
    await updateSecret(key, editValue.trim());
    setEditingKey(null);
    setEditValue('');
  };

  const handleDelete = async (key: string) => {
    if (confirm(`Are you sure you want to delete "${key}"?`)) {
      await deleteSecret(key);
    }
  };

  const startEdit = (secret: Secret) => {
    setEditingKey(secret.key);
    setEditValue('');
  };

  const getDecryptedValue = (key: string) => {
    const found = decryptedSecrets.find(s => s.key === key);
    return found?.value || '***';
  };

  if (loading && !secrets.length) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="secret-manager">
      <h2>Secret Manager</h2>
      
      {app && (
        <div className="app-info">
          <h3>App: {app.name}</h3>
          <p>{app.description || 'No description'}</p>
        </div>
      )}

      {error && <div className="error">Error: {error}</div>}

      <form onSubmit={handleCreate} className="create-form">
        <h3>Create New Secret</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Secret key (e.g., API_KEY)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Secret value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newKey.trim() || !newValue.trim()}>
            Create
          </button>
        </div>
      </form>

      <div className="secrets-section">
        <div className="secrets-header">
          <h3>Secrets ({secrets.length})</h3>
          <button 
            onClick={() => {
              if (!showDecrypted) {
                fetchDecryptedSecrets();
              }
              setShowDecrypted(!showDecrypted);
            }}
            className="toggle-btn"
          >
            {showDecrypted ? 'Hide Values' : 'Show Decrypted Values'}
          </button>
        </div>

        {secrets.length === 0 ? (
          <p className="no-secrets">No secrets yet. Create one above!</p>
        ) : (
          <ul className="secrets-list">
            {secrets.map((secret) => (
              <li key={secret.id} className="secret-item">
                {editingKey === secret.key ? (
                  <div className="edit-form">
                    <span className="key">{secret.key}</span>
                    <input
                      type="text"
                      placeholder="New value"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button onClick={() => handleUpdate(secret.key)} disabled={loading}>
                      Save
                    </button>
                    <button onClick={() => setEditingKey(null)} disabled={loading}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="secret-display">
                    <div className="secret-info">
                      <span className="key">{secret.key}</span>
                      <span className="value">
                        {showDecrypted ? getDecryptedValue(secret.key) : '••••••••'}
                      </span>
                    </div>
                    <div className="actions">
                      <button onClick={() => startEdit(secret)} disabled={loading}>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(secret.key)} 
                        disabled={loading}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
