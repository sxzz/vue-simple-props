import VueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
  plugins: [VueJsx()],
})
