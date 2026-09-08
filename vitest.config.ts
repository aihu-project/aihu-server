import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: { __DEV__: 'true' },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    passWithNoTests: false,
    env: { AIHU_NATIVE_SKIP: '1' },
  },
})
