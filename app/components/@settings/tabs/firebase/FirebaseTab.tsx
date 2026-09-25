import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { toast } from 'react-toastify';
import { classNames } from '~/utils/classNames';
import { firebaseConnection, updateFirebaseConnection, parseFirebaseConfig } from '~/lib/stores/firebase';

export default function FirebaseTab() {
  const connection = useStore(firebaseConnection);
  const [configText, setConfigText] = useState('');
  const isConnected = !!(connection.isConnected && connection.config);

  const handleConnect = () => {
    const parsed = parseFirebaseConfig(configText);

    if (!parsed) {
      toast.error('Could not find apiKey, projectId, and appId — paste the full config snippet from Firebase console');
      return;
    }

    updateFirebaseConnection({ config: parsed, isConnected: true });
    toast.success('Successfully connected to Firebase');
    setConfigText('');
  };

  const handleDisconnect = () => {
    updateFirebaseConnection({ config: null, isConnected: false });
    toast.success('Disconnected from Firebase');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <img className="w-6 h-6" crossOrigin="anonymous" src="https://cdn.simpleicons.org/firebase" />
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Firebase</h3>
          <p className="text-sm text-bolt-elements-textSecondary">Setup Firebase project connection</p>
        </div>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-bolt-elements-textPrimary">
              <div className="i-ph:check-circle text-accent-500" />
              Connected
            </div>
            <div className="text-sm text-bolt-elements-textSecondary">
              Project: <span className="font-mono">{connection.config?.projectId}</span>
            </div>
            <div className="text-sm text-bolt-elements-textSecondary">
              API Key: <span className="font-mono">{connection.config?.apiKey}</span>
            </div>
            {connection.config?.authDomain && (
              <div className="text-sm text-bolt-elements-textSecondary">
                Auth Domain: <span className="font-mono">{connection.config.authDomain}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <a
              href={`https://console.firebase.google.com/project/${connection.config?.projectId}/overview`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text hover:bg-bolt-elements-button-secondary-backgroundHover inline-flex items-center gap-1"
            >
              Open in Firebase console
              <div className="i-ph:arrow-square-out w-4 h-4" />
            </a>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 rounded-lg text-sm bg-bolt-elements-button-danger-background text-bolt-elements-button-danger-text hover:bg-bolt-elements-button-danger-backgroundHover"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm text-bolt-elements-textSecondary">
            Firebase config (paste the whole snippet or JSON)
          </label>
          <textarea
            value={configText}
            onChange={(event) => setConfigText(event.target.value)}
            placeholder={'const firebaseConfig = {\n  apiKey: "...",\n  projectId: "...",\n  appId: "...",\n  ...\n};'}
            rows={6}
            className={classNames(
              'w-full px-3 py-2 rounded-lg text-sm font-mono resize-none',
              'bg-bolt-elements-background-depth-1',
              'border border-bolt-elements-borderColor',
              'text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary',
              'focus:outline-none focus:ring-1 focus:ring-accent-500',
            )}
          />
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-500 hover:underline inline-flex items-center gap-1"
          >
            Open Firebase console — Project settings → Your apps → SDK setup and configuration
            <div className="i-ph:arrow-square-out w-4 h-4" />
          </a>
          <p className="text-xs text-bolt-elements-textTertiary">
            This is your project's public web config, not a secret — Firebase protects data via Security Rules, not by
            hiding this.
          </p>
          <button
            onClick={handleConnect}
            disabled={!configText.trim()}
            className="px-4 py-2 rounded-lg text-sm bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <div className="i-ph:plug-charging w-4 h-4" />
            Connect
          </button>
        </div>
      )}
    </div>
  );
}
