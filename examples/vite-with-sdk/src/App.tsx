import { SecretManager } from './components/SecretManager';
import { client, APP_ID } from './client';
import './App.css';

function App() {
  const isConfigured = APP_ID && client;

  return (
    <div className="app">
      <header>
        <h1>env-dev SDK Example</h1>
        <p>Vite + React + TypeScript + env-dev-sdk</p>
      </header>

      <main>
        {!isConfigured ? (
          <div className="setup-notice">
            <h2>Setup Required</h2>
            <p>
              Please copy <code>.env.example</code> to <code>.env</code> and configure your credentials:
            </p>
            <ol>
              <li>Ensure env-dev is running in Docker (port 3001)</li>
              <li>Create an app in env-dev and get the App ID</li>
              <li>Copy the API key from your app settings</li>
              <li>Update the <code>.env</code> file with your credentials</li>
            </ol>
          </div>
        ) : (
          <SecretManager />
        )}
      </main>

      <footer>
        <p>
          Using <code>env-dev-sdk</code> to interact with env-dev at{' '}
          <code>{import.meta.env.VITE_ENVDEV_URL || 'http://localhost:3001'}</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
