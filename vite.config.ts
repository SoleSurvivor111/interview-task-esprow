import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      components: path.resolve(__dirname, 'src', 'components'),
      assets: path.resolve(__dirname, 'src', 'assets'),
      types: path.resolve(__dirname, 'src', 'types'),
    },
  },
})
