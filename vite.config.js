import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import serviceWorker from './pwa/plugin.js';

export default defineConfig({ plugins: [react(), serviceWorker()] });
