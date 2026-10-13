import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/Dean-Shoes-Brooks/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'spa-github-pages',
      closeBundle() {
        const index = resolve('dist/index.html')
        if (existsSync(index)) {
          copyFileSync(index, resolve('dist/404.html'))
        }
      },
    },
  ],
})
