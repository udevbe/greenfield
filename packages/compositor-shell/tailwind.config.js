// eslint-disable-next-line @typescript-eslint/no-var-requires
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  content: [join(__dirname, '/index.html'), join(__dirname, '/src/**/*.{js,ts,jsx,tsx}')],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
