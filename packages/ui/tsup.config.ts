import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  ...options,
  banner: {
    js: "'use client'",
  },
  treeshake: true,
  dts: true,
  minify: false,
  clean: true,
  outDir: 'dist',

  // Single entry point for better bundling
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],

  // Generate source maps for debugging
  sourcemap: true,

  // Split chunks for better tree shaking
  splitting: false,

  // External dependencies - don't bundle these
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@hookform/resolvers',
    '@radix-ui/react-accordion',
    '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-tabs',
    '@radix-ui/react-tooltip',
    'clsx',
    'date-fns',
    'embla-carousel-react',
    'lucide-react',
    'react-day-picker',
    'react-dropzone',
    'react-headless-pagination',
    'react-hook-form',
    'react-if',
    'react-to-print',
    'tailwind-merge',
    'tailwindcss-animate',
    'usehooks-ts',
    'vaul',
    'zod',
  ],

  // ESBuild options for React
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.target = 'es2017';
    options.banner = {
      js: '"use client";',
    };
  },

  // Run custom script after build
  onSuccess: 'node strip-use-client.mjs',
}));
