// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './client',
  publicDir: '../public',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/api/proxy/devpost': {
        target: 'https://devpost.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => '/api/hackathons?challenge_type=all&status=upcoming',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (compatible; DevProxy/1.0)');
            proxyReq.setHeader('Accept', 'application/json');
          });
        }
      }
    }
  }
});
