import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  if (!chat.started) {
    return null;
  }

  return (
    <header className="flex items-center px-4 border-b border-bolt-elements-borderColor h-[var(--header-height)]">
      <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
        <ClientOnly>{() => <ChatDescription />}</ClientOnly>
      </span>
      <ClientOnly>
        {() => (
          <div className="">
            <HeaderActionButtons chatStarted={chat.started} />
          </div>
        )}
      </ClientOnly>
    </header>
  );
}
