import { describe, expect, it } from 'vitest';
import { montarServiceWorker } from '../pwa/plugin.js';
import MODELO from '../pwa/sw.js?raw';
import manifestoBruto from '../public/manifest.webmanifest?raw';

type Montado = { codigo: string; versao: string; arquivos: string[] };
const montar = montarServiceWorker as (m: string, a: string[], c?: string) => Montado;

const ICONES = Object.keys(import.meta.glob('../public/icons/*.png'));
const MANIFESTO = JSON.parse(manifestoBruto) as {
  icons: { src: string; sizes: string; purpose: string }[];
  start_url: string;
  display: string;
};

describe('PWA', () => {
  it('o service worker sai com a versão e a lista de arquivos do build', () => {
    const { codigo, versao, arquivos } = montar(MODELO, [
      '/assets/b.js',
      '/',
      '/assets/a.css',
      '/',
    ]);
    expect(arquivos).toEqual(['/', '/assets/a.css', '/assets/b.js']);
    expect(codigo).toContain(`const VERSAO = "${versao}"`);
    expect(codigo).toContain('const ARQUIVOS = ["/","/assets/a.css","/assets/b.js"]');
    expect(codigo).not.toMatch(/__VERSAO__|__ARQUIVOS__/);
  });

  it('cada build diferente gera uma versão nova (e o mesmo build, a mesma)', () => {
    const a = montar(MODELO, ['/', '/assets/index-1.js']).versao;
    expect(montar(MODELO, ['/', '/assets/index-1.js']).versao).toBe(a);
    expect(montar(MODELO, ['/', '/assets/index-2.js']).versao).not.toBe(a);
    expect(montar(MODELO, ['/', '/assets/index-1.js'], '<html>novo</html>').versao).not.toBe(a);
  });

  it('falha o build se os marcadores sumirem do modelo (ex.: formatação)', () => {
    expect(() => montar('const VERSAO = 1;', ['/'])).toThrow(/marcadores/);
  });

  it('o service worker não guarda nada de outra origem (API e PDFs)', () => {
    expect(MODELO).toMatch(/url\.origin !== self\.location\.origin\) return/);
  });

  it('manifesto tem o mínimo para instalar: ícones 192 e 512, maskable, standalone', () => {
    expect(MANIFESTO.start_url).toBe('/');
    expect(MANIFESTO.display).toBe('standalone');
    const tamanhos = MANIFESTO.icons.map((i) => i.sizes);
    expect(tamanhos).toContain('192x192');
    expect(tamanhos).toContain('512x512');
    expect(MANIFESTO.icons.some((i) => i.purpose === 'maskable')).toBe(true);
    for (const i of MANIFESTO.icons) expect(ICONES).toContain(`../public${i.src}`);
  });
});
