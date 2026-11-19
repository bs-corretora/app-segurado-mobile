// Os atalhos do assistente chegam como caminho no estilo web (`/apolices/:id`); aqui viram a tela
// do app (nome usado em `go()`) e o argumento. Caminho que o app não conhece devolve `null`, e o
// botão não aparece.
import type { AtalhoAssistente } from '../api';
import type { Rota } from '../app/nav';

/** Listas e telas fixas: caminho → tela. */
const FIXAS: Record<string, string> = {
  inicio: 'home',
  apolices: 'apolices',
  sinistros: 'sinistro',
  'sinistros/novo': 'sin-novo',
  cotacoes: 'cotacao',
  'cotacoes/nova': 'cot-prod',
  contatos: 'ajuda',
  notificacoes: 'notif',
  perfil: 'perfil',
  indicacoes: 'indicar',
};

/** Telas de detalhe: primeira parte do caminho → tela que recebe o id. */
const DETALHE: Record<string, string> = {
  apolices: 'apolice',
  sinistros: 'sin-det',
  cotacoes: 'cot-det',
};

export function destinoDoAtalho({ tela, id }: AtalhoAssistente): Rota | null {
  const partes = (tela.split(/[?#]/)[0] ?? '').split('/').filter(Boolean);
  if (!partes.length || partes.length > 2) return null;
  const base = partes[0]!.toLowerCase();
  const segundo = partes[1];

  if (!segundo) {
    // `/apolices` com `id` leva direto ao detalhe.
    if (id && DETALHE[base]) return [DETALHE[base], id];
    const fixa = FIXAS[base];
    return fixa ? [fixa] : null;
  }

  const fixa = FIXAS[`${base}/${segundo.toLowerCase()}`];
  if (fixa) return [fixa];

  const detalhe = DETALHE[base];
  if (!detalhe) return null;
  // `/apolices/:id` literal (o molde, sem o valor) só vale se o `id` vier à parte.
  const arg = segundo.startsWith(':') ? id : segundo;
  return arg ? [detalhe, arg] : null;
}
