import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStore } from '@nanostores/react';
import {
  firebaseConnection,
  updateFirebaseConnection,
  initializeFirebaseConnection,
  parseFirebaseConfig,
} from '~/lib/stores/firebase';

export function useFirebaseConnection() {
  const connection = useStore(firebaseConnection);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [configText, setConfigText] = useState('');

  useEffect(() => {
    initializeFirebaseConnection();
  }, []);

  const handleConnect = () => {
    const parsed = parseFirebaseConfig(configText);

    if (!parsed) {
      toast.error('Could not find apiKey, projectId, and appId — paste the full config snippet from Firebase console');
      return false;
    }

    updateFirebaseConnection({ config: parsed, isConnected: true });
    toast.success('Successfully connected to Firebase');
    setConfigText('');

    return true;
  };

  const handleDisconnect = () => {
    updateFirebaseConnection({ config: null, isConnected: false });
    toast.success('Disconnected from Firebase');
    setIsDialogOpen(false);
  };

  return {
    connection,
    isDialogOpen,
    setIsDialogOpen,
    configText,
    setConfigText,
    handleConnect,
    handleDisconnect,
    isConnected: !!(connection.isConnected && connection.config),
  };
}
