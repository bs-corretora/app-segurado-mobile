// Plugin do Vite que gera o /sw.js no build, com a lista exata dos arquivos daquele build.
// A versão é um hash do conteúdo: cada deploy que muda o app gera um service worker novo.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const MODELO = new URL('./sw.js', import.meta.url);

/** Todos os arquivos de uma pasta, com caminho relativo e barra normal. */
function listarPasta(pasta) {
  try {
    return readdirSync(pasta, { recursive: true, withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) =>
        relative(pasta, join(d.parentPath ?? d.path, d.name))
          .split(sep)
          .join('/'),
      );
  } catch {
    return [];
  }
}

/**
 * Preenche o modelo do service worker.
 * @param {string} modelo conteúdo de pwa/sw.js
 * @param {string[]} arquivos URLs a guardar (ex.: `/assets/index-abc.js`)
 * @param {string} [conteudo] o que mais entra no hash da versão (ex.: o index.html)
 */
export function montarServiceWorker(modelo, arquivos, conteudo = '') {
  if (!modelo.includes('self.__VERSAO__') || !modelo.includes('self.__ARQUIVOS__'))
    throw new Error('pwa/sw.js: marcadores self.__VERSAO__/self.__ARQUIVOS__ não encontrados');
  const lista = [...new Set(arquivos)].sort();
  const versao = createHash('sha256')
    .update(modelo)
    .update(lista.join('\n'))
    .update(conteudo)
    .digest('hex')
    .slice(0, 12);
  const saida = modelo
    .replace('self.__VERSAO__', JSON.stringify(versao))
    .replace('self.__ARQUIVOS__', JSON.stringify(lista));
  return { codigo: saida, versao, arquivos: lista };
}

export default function serviceWorker() {
  let pastaPublica = '';
  return {
    name: 'bs-service-worker',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      pastaPublica = config.publicDir;
    },
    generateBundle(_opcoes, bundle) {
      const doBuild = Object.keys(bundle).filter((f) => !f.endsWith('.map') && f !== 'index.html');
      const publicos = listarPasta(pastaPublica).filter((f) => f !== 'sw.js');
      const html = bundle['index.html'];
      const conteudoHtml = html && html.type === 'asset' ? String(html.source) : '';
      const { codigo } = montarServiceWorker(
        readFileSync(MODELO, 'utf8'),
        ['/', ...doBuild.map((f) => `/${f}`), ...publicos.map((f) => `/${f}`)],
        conteudoHtml,
      );
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: codigo });
    },
  };
}
