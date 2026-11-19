// Teste de fumaça: renderiza todas as telas no servidor e falha se alguma quebrar.
// Os dados da API chegam depois (em efeitos), então aqui cada tela aparece no estado inicial.
import { createRequire } from 'node:module';
import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

// No Windows o terminal pode abrir em "c:\" e o Vite resolver em "C:\": seriam duas cópias do
// React e o erro "Invalid hook call". Tudo parte do caminho real da pasta do projeto.
const raiz = realpathSync.native(fileURLToPath(new URL('..', import.meta.url)));
const exigir = createRequire(join(raiz, 'package.json'));
const { createElement: h } = exigir('react');
const { renderToString } = exigir('react-dom/server');

const vite = await createServer({
  root: raiz,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
const { Raiz } = await vite.ssrLoadModule('/src/app/App.tsx');
const { SCREENS } = await vite.ssrLoadModule('/src/screens/index.ts');
const { PRODUTOS } = await vite.ssrLoadModule('/src/constants/rotulos.ts');

const ID = '00000000-0000-0000-0000-000000000000';
const args = {
  apolice: [ID],
  'sin-ok': [ID],
  'sin-det': [ID],
  'cot-form': [...PRODUTOS, 'INEXISTENTE'],
  'cot-det': [ID],
};
let total = 0;
for (const name of Object.keys(SCREENS)) {
  for (const a of args[name] ?? [undefined]) {
    const html = renderToString(h(Raiz, { start: [name, a] }));
    if (!html.includes('<main')) throw new Error(`Tela vazia: ${name}`);
    total++;
  }
}
console.log(`OK — ${total} renderizações em ${Object.keys(SCREENS).length} telas`);
await vite.close();
