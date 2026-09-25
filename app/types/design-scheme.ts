export interface DesignScheme {
  palette: { [key: string]: string }; // Changed from string[] to object
  features: string[];
  font: string[];
}

/*
 * VoltairStudio's own "Persimmon / Obsidian" identity, ported from
 * GameForge's dashboard visual refresh, as the default suggested to the AI
 * for generated sites (still just a starting point — fully editable via
 * the Design Palette dialog, or overridden by a real Inspo reference via
 * the References page's "Copy as Design Scheme" button).
 */
export const defaultDesignScheme: DesignScheme = {
  palette: {
    primary: '#FF4F00',
    secondary: '#4FA8D8',
    accent: '#FF6A2B',
    background: '#0A0A0A',
    surface: '#121212',
    text: '#EDEDED',
    textSecondary: '#9A9A9A',
    border: '#262626',
    success: '#8ea885',
    warning: '#f59e0b',
    error: '#c46a4f',
  },
  features: ['rounded'],
  font: ['sans-serif'],
};

export const paletteRoles = [
  {
    key: 'primary',
    label: 'Primary',
    description: 'Main brand color - use for primary buttons, active links, and key interactive elements',
  },
  {
    key: 'secondary',
    label: 'Secondary',
    description: 'Supporting brand color - use for secondary buttons, inactive states, and complementary elements',
  },
  {
    key: 'accent',
    label: 'Accent',
    description: 'Highlight color - use for badges, notifications, focus states, and call-to-action elements',
  },
  {
    key: 'background',
    label: 'Background',
    description: 'Page backdrop - use for the main application/website background behind all content',
  },
  {
    key: 'surface',
    label: 'Surface',
    description: 'Elevated content areas - use for cards, modals, dropdowns, and panels that sit above the background',
  },
  { key: 'text', label: 'Text', description: 'Primary text - use for headings, body text, and main readable content' },
  {
    key: 'textSecondary',
    label: 'Text Secondary',
    description: 'Muted text - use for captions, placeholders, timestamps, and less important information',
  },
  {
    key: 'border',
    label: 'Border',
    description: 'Separators - use for input borders, dividers, table lines, and element outlines',
  },
  {
    key: 'success',
    label: 'Success',
    description: 'Positive feedback - use for success messages, completed states, and positive indicators',
  },
  {
    key: 'warning',
    label: 'Warning',
    description: 'Caution alerts - use for warning messages, pending states, and attention-needed indicators',
  },
  {
    key: 'error',
    label: 'Error',
    description: 'Error states - use for error messages, failed states, and destructive action indicators',
  },
];

export const designFeatures = [
  { key: 'rounded', label: 'Rounded Corners' },
  { key: 'border', label: 'Subtle Border' },
  { key: 'gradient', label: 'Gradient Accent' },
  { key: 'shadow', label: 'Soft Shadow' },
  { key: 'frosted-glass', label: 'Frosted Glass' },
];

export const designFonts = [
  { key: 'sans-serif', label: 'Sans Serif', preview: 'Aa' },
  { key: 'serif', label: 'Serif', preview: 'Aa' },
  { key: 'monospace', label: 'Monospace', preview: 'Aa' },
  { key: 'cursive', label: 'Cursive', preview: 'Aa' },
  { key: 'fantasy', label: 'Fantasy', preview: 'Aa' },
];
