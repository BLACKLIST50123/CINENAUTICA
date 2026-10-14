import { defineConfig } from 'vitest/config';
import fs from 'fs';
import path from 'path';

// Parsear .env.local de forma nativa sin dependencias ESM
function cargarEnvLocal() {
  const env: Record<string, string> = {};
  const envPath = path.resolve(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: cargarEnvLocal(),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
