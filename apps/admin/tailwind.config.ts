import type { Config } from 'tailwindcss';
import uiPreset from '@flames/ui/tailwind.preset';

const config: Config = {
  presets: [uiPreset as Config],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
