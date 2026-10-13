import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuración de Vitest para testear los services de negocio
// (motor de tarifas, validaciones, cálculo de puntos, etc.)
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // los services no dependen del DOM
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/services/**', 'src/daos/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
