import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      // Só a lógica que não depende de tela: cliente da API, hooks e utilitários.
      include: ['src/api/**', 'src/hooks/**', 'src/utils/**'],
      exclude: ['src/api/tipos.ts'],
      reporter: ['text-summary', 'text'],
      // Mínimo de 80% de linhas em cada pasta (#14). Abaixo disso, `npm run test:cobertura` falha.
      thresholds: {
        'src/api/**': { lines: 80 },
        'src/hooks/**': { lines: 80 },
        'src/utils/**': { lines: 80 },
      },
    },
  },
});
