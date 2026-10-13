import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

let outputDirectory = resolve('dist')

const spaFallback: Plugin = {
  name: 'spa-github-pages',
  configResolved(config) {
    outputDirectory = config.build.outDir
  },
  closeBundle() {
    const index = resolve(outputDirectory, 'index.html')
    if (existsSync(index)) {
      copyFileSync(index, resolve(outputDirectory, '404.html'))
    }
  },
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/Dean-Shoes-Brooks/' : '/',
  plugins: [react(), tailwindcss(), spaFallback],
})
