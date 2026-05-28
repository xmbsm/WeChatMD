import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
  server: {
    fs: {
      allow: [
        resolve(__dirname),
        resolve(__dirname, 'src'),
        resolve(__dirname, 'public')
      ]
    },
    watch: {
      ignored: ['**/mdeditor-main/**', '**/EJ-Publish/**', '**/raphael-publish-main/**']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    preserveSymlinks: true
  }
})
