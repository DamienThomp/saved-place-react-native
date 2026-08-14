import { defineConfig } from 'vitest/config';
import { reactNative } from 'vitest-native';

export default defineConfig({
  plugins: [reactNative()],
  test: {
    environment: 'react-native',
    globals: true,
    setupFiles: ['./test/vitest.setup.ts'],
    testTimeout: 10000,
  },
});
