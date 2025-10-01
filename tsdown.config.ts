import { defineConfig } from 'tsdown'

export default defineConfig({
  target: 'es2021',
  platform: 'neutral',
  exports: {
    devExports: 'dev',
  },
})
