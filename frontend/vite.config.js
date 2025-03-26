import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

import builtins from 'rollup-plugin-node-builtins';

const builtinsPlugin = {
  ...builtins({ crypto: true }),
  name: 'rollup-plugin-node-builtins',
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
      {
        // FIXME(https://github.com/mui/material-ui/issues/35233)
        find: /^@mui\/icons-material\/(?!esm\/)([^/]*)/,
        replacement: '@mui/icons-material/esm/$1',
      },
    ],
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
  rollupInputOptions: {
    preserveEntrySignatures: 'strict',
    plugins: [builtinsPlugin],
  },
});
