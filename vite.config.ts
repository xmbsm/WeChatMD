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
      // 只允许访问项目根目录和src目录
      allow: [
        resolve(__dirname),
        resolve(__dirname, 'src'),
        resolve(__dirname, 'public')
      ]
    }
  },
  resolve: {
    // 明确指定解析路径
    alias: {
      '@': resolve(__dirname, 'src')
    },
    // 禁用自动导入
    preserveSymlinks: true
  }
})
