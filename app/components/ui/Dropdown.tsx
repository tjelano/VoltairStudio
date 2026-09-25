import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  className?: string;
}

export const DropdownItem = ({ children, onSelect, className }: DropdownItemProps) => (
  <DropdownMenu.Item
    className={classNames(
      'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
      'text-bolt-elements-textPrimary hover:text-bolt-elements-textPrimary',
      'hover:bg-bolt-elements-background-depth-3',
      'transition-colors cursor-pointer',
      'outline-none',
      className,
    )}
    onSelect={onSelect}
  >
    {children}
  </DropdownMenu.Item>
);

export const DropdownSeparator = () => <DropdownMenu.Separator className="h-px bg-bolt-elements-borderColor my-1" />;

interface DropdownCheckboxItemProps {
  children: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const DropdownCheckboxItem = ({ children, checked, onCheckedChange, className }: DropdownCheckboxItemProps) => (
  <DropdownMenu.CheckboxItem
    checked={checked}
    onCheckedChange={onCheckedChange}
    onSelect={(event) => event.preventDefault()}
    className={classNames(
      'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
      'text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3',
      'transition-colors cursor-pointer outline-none',
      className,
    )}
  >
    <div
      className={classNames(
        'w-4 h-4 rounded border flex items-center justify-center shrink-0',
        checked ? 'bg-accent-500 border-accent-500' : 'border-bolt-elements-borderColor',
      )}
    >
      {checked && <div className="i-ph:check-bold text-white text-[10px]" />}
    </div>
    {children}
  </DropdownMenu.CheckboxItem>
);

interface DropdownRadioItemProps {
  children: ReactNode;
  checked: boolean;
  onSelect: () => void;
  className?: string;
}

/**
 * A single-select pill that supports toggling back off (unlike Radix's own RadioGroup/RadioItem,
 * which don't allow deselecting once a value is chosen). Built on plain DropdownMenu.Item (not
 * RadioItem) with role/aria-checked overridden to still register with Radix's roving keyboard
 * focus and announce correctly to assistive tech — plain <button>s here would be invisible to
 * arrow-key navigation since Radix only tracks its own registered item types.
 */
export const DropdownRadioItem = ({ children, checked, onSelect, className }: DropdownRadioItemProps) => (
  <DropdownMenu.Item
    role="radio"
    aria-checked={checked}
    onSelect={(event) => {
      event.preventDefault();
      onSelect();
    }}
    className={classNames(
      'px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer outline-none inline-flex',
      checked
        ? 'bg-accent-500 border-accent-500 text-white'
        : 'border-bolt-elements-borderColor text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3',
      className,
    )}
  >
    {children}
  </DropdownMenu.Item>
);

export const Dropdown = ({ trigger, children, align = 'end', sideOffset = 5 }: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={classNames(
            'min-w-[220px] rounded-lg p-2',
            'bg-bolt-elements-background-depth-2',
            'border border-bolt-elements-borderColor',
            'shadow-lg',
            'animate-in fade-in-80 zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
            'z-[1000]',
          )}
          sideOffset={sideOffset}
          align={align}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
