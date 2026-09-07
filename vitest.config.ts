import path from 'path';

import { defineConfig } from 'vitest/config';
import { reactNative } from 'vitest-native';

export default defineConfig({
  plugins: [reactNative()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    setupFiles: ['./test/vitest.setup.js'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
    testTimeout: 10000,
  },
});
