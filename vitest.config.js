import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [...configDefaults.exclude, '**/.kilo/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/types.ts', 'src/**/__generated__/**'],
      reportsDirectory: './coverage',
    },
  },
});
