import { describe, expect, it } from 'vitest';
import { trechosDoAssistente } from '../src/utils/textoAssistente';

describe('trechosDoAssistente', () => {
  it('troca **negrito** por trecho marcado, sem asteriscos', () => {
    expect(trechosDoAssistente('Toque em **Abrir sinistro** agora.')).toEqual([
      { texto: 'Toque em ', negrito: false },
      { texto: 'Abrir sinistro', negrito: true },
      { texto: ' agora.', negrito: false },
    ]);
  });

  it('tira títulos, código e marcadores de lista', () => {
    const t = trechosDoAssistente('## Passos\n- um\n* dois\nuse `Sinistro`');
    expect(t.map((x) => x.texto).join('')).toBe('Passos\n• um\n• dois\nuse Sinistro');
  });

  it('texto sem Markdown passa igual', () => {
    expect(trechosDoAssistente('Sua apólice vence em 01/01/2027.')).toEqual([
      { texto: 'Sua apólice vence em 01/01/2027.', negrito: false },
    ]);
  });

  it('itálico solto perde só os asteriscos', () => {
    expect(trechosDoAssistente('é *importante* ver')[0]!.texto).toBe('é importante ver');
  });
});
