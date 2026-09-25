import { useFirebaseConnection } from '~/lib/hooks/useFirebaseConnection';
import { classNames } from '~/utils/classNames';
import { Dialog, DialogRoot, DialogClose, DialogTitle, DialogButton } from '~/components/ui/Dialog';

export function FirebaseConnection() {
  const {
    connection,
    isDialogOpen,
    setIsDialogOpen,
    configText,
    setConfigText,
    handleConnect,
    handleDisconnect,
    isConnected,
  } = useFirebaseConnection();

  return (
    <div className="relative">
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden mr-2 text-sm">
        <button
          onClick={() => setIsDialogOpen(!isDialogOpen)}
          className={classNames('flex items-center p-1.5 gap-2', {
            'bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary':
              !isConnected,
            'bg-bolt-elements-item-backgroundDefault text-bolt-elements-item-contentAccent': isConnected,
          })}
        >
          <img
            className="w-4 h-4"
            height="20"
            width="20"
            crossOrigin="anonymous"
            src="https://cdn.simpleicons.org/firebase"
          />
          {isConnected && connection.config && (
            <span className="ml-1 text-xs max-w-[100px] truncate">{connection.config.projectId}</span>
          )}
        </button>
      </div>

      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {isDialogOpen && (
          <Dialog className="max-w-[520px] p-6">
            {!isConnected ? (
              <div className="space-y-4">
                <DialogTitle>
                  <img
                    className="w-5 h-5"
                    height="24"
                    width="24"
                    crossOrigin="anonymous"
                    src="https://cdn.simpleicons.org/firebase"
                  />
                  Connect to Firebase
                </DialogTitle>

                <div>
                  <label className="block text-sm text-bolt-elements-textSecondary mb-2">
                    Firebase config (paste the whole snippet or JSON)
                  </label>
                  <textarea
                    value={configText}
                    onChange={(event) => setConfigText(event.target.value)}
                    placeholder={
                      'const firebaseConfig = {\n  apiKey: "...",\n  projectId: "...",\n  appId: "...",\n  ...\n};'
                    }
                    rows={6}
                    className={classNames(
                      'w-full px-3 py-2 rounded-lg text-sm font-mono resize-none',
                      'bg-[#F8F8F8] dark:bg-[#1A1A1A]',
                      'border border-[#E5E5E5] dark:border-[#333333]',
                      'text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary',
                      'focus:outline-none focus:ring-1 focus:ring-accent-500',
                    )}
                  />
                  <div className="mt-2 text-sm text-bolt-elements-textSecondary">
                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-500 hover:underline inline-flex items-center gap-1"
                    >
                      Open Firebase console — Project settings → Your apps → SDK setup and configuration
                      <div className="i-ph:arrow-square-out w-4 h-4" />
                    </a>
                  </div>
                  <p className="mt-2 text-xs text-bolt-elements-textTertiary">
                    This is your project's public web config, not a secret — Firebase protects data via Security Rules,
                    not by hiding this.
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <DialogClose asChild>
                    <DialogButton type="secondary">Cancel</DialogButton>
                  </DialogClose>
                  <button
                    onClick={handleConnect}
                    disabled={!configText.trim()}
                    className={classNames(
                      'px-4 py-2 rounded-lg text-sm flex items-center gap-2',
                      'bg-accent-500 text-white',
                      'hover:bg-accent-600',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                  >
                    <div className="i-ph:plug-charging w-4 h-4" />
                    Connect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <DialogTitle>
                  <img
                    className="w-5 h-5"
                    height="24"
                    width="24"
                    crossOrigin="anonymous"
                    src="https://cdn.simpleicons.org/firebase"
                  />
                  Firebase Connection
                </DialogTitle>

                <div className="p-3 bg-[#F8F8F8] dark:bg-[#1A1A1A] rounded-lg space-y-1">
                  <h4 className="text-sm font-medium text-bolt-elements-textPrimary flex items-center gap-1">
                    <div className="i-ph:database w-3 h-3 text-accent-500" />
                    {connection.config?.projectId}
                  </h4>
                  <p className="text-xs text-bolt-elements-textSecondary font-mono truncate">
                    {connection.config?.apiKey}
                  </p>
                </div>

                <a
                  href={`https://console.firebase.google.com/project/${connection.config?.projectId}/overview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-500 hover:underline inline-flex items-center gap-1"
                >
                  Open in Firebase console
                  <div className="i-ph:arrow-square-out w-4 h-4" />
                </a>

                <div className="flex justify-end gap-2 mt-6">
                  <DialogClose asChild>
                    <DialogButton type="secondary">Close</DialogButton>
                  </DialogClose>
                  <DialogButton type="danger" onClick={handleDisconnect}>
                    <div className="i-ph:plugs w-4 h-4" />
                    Disconnect
                  </DialogButton>
                </div>
              </div>
            )}
          </Dialog>
        )}
      </DialogRoot>
    </div>
  );
}
