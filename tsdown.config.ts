import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'es2021',
  clean: true,
  dts: true,
  platform: 'neutral',
})
