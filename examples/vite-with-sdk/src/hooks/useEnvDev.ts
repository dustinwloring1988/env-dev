import { useState, useEffect, useCallback } from 'react';
import { client, APP_ID } from '../client';
import type { App, Secret, DecryptedSecret } from 'env-dev-sdk';

export function useEnvDev() {
  const [app, setApp] = useState<App | null>(null);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [decryptedSecrets, setDecryptedSecrets] = useState<DecryptedSecret[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApp = useCallback(async () => {
    if (!APP_ID) return;
    setLoading(true);
    setError(null);
    try {
      const appData = await client.getApp(APP_ID);
      setApp(appData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch app');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSecrets = useCallback(async () => {
    if (!APP_ID) return;
    setLoading(true);
    setError(null);
    try {
      const secretsData = await client.getSecrets(APP_ID);
      setSecrets(secretsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch secrets');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDecryptedSecrets = useCallback(async () => {
    if (!APP_ID) return;
    setLoading(true);
    setError(null);
    try {
      const decrypted = await client.getDecryptedSecrets(APP_ID);
      setDecryptedSecrets(decrypted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch decrypted secrets');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSecret = useCallback(async (key: string, value: string) => {
    if (!APP_ID) return;
    setLoading(true);
    setError(null);
    try {
      await client.createSecret(APP_ID, key, value);
      await fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create secret');
    } finally {
      setLoading(false);
    }
  }, [fetchSecrets]);

  const updateSecret = useCallback(async (key: string, value: string) => {
    if (!APP_ID) return;
    setLoading(true);
    setError(null);
    try {
      await client.updateSecret(APP_ID, key, value);
      await fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update secret');
    } finally {
      setLoading(false);
    }
  }, [fetchSecrets]);

  const deleteSecret = useCallback(async (key: string) => {
    if (!APP_ID) return;
    setLoading(true);
    setError(null);
    try {
      await client.deleteSecret(APP_ID, key);
      await fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete secret');
    } finally {
      setLoading(false);
    }
  }, [fetchSecrets]);

  useEffect(() => {
    if (APP_ID) {
      fetchApp();
      fetchSecrets();
    }
  }, [fetchApp, fetchSecrets]);

  return {
    app,
    secrets,
    decryptedSecrets,
    loading,
    error,
    fetchApp,
    fetchSecrets,
    fetchDecryptedSecrets,
    createSecret,
    updateSecret,
    deleteSecret,
  };
}
