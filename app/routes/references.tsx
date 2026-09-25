import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { Menu } from '~/components/sidebar/Menu.client';
import { ReferencesPage } from '~/components/references/ReferencesPage.client';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [
    { title: 'References - VoltairStudio' },
    { name: 'description', content: 'Browse and save design references' },
  ];
};

export const loader = () => json({});

export default function References() {
  return (
    <div className="relative flex h-full w-full overflow-hidden bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <ClientOnly>{() => <Menu />}</ClientOnly>
      <div className="flex-1 min-w-0 overflow-hidden">
        <ClientOnly>{() => <ReferencesPage />}</ClientOnly>
      </div>
    </div>
  );
}
