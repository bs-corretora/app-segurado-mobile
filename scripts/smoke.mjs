// Teste de fumaça: renderiza todas as telas no servidor e falha se alguma quebrar.
import { createServer } from 'vite'
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { Shell } = await vite.ssrLoadModule('/src/App.jsx')
const { NavProvider } = await vite.ssrLoadModule('/src/nav.jsx')
const { SCREENS } = await vite.ssrLoadModule('/src/screens/index.js')

const args = { apolice: [0, 1, 2], pdf: [0, 1, 2], 'cot-form': ['Auto', 'Residencial', 'Vida', 'Empresarial'], 'cot-det': [0, 1] }
let total = 0
for (const name of Object.keys(SCREENS)) {
  for (const a of args[name] ?? [undefined]) {
    const html = renderToString(h(NavProvider, { start: [name, a] }, h(Shell)))
    if (!html.includes('<main')) throw new Error(`Tela vazia: ${name}`)
    total++
  }
}
console.log(`OK — ${total} renderizações em ${Object.keys(SCREENS).length} telas`)
await vite.close()
