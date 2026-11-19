// A resposta do assistente às vezes vem com Markdown simples (**negrito**, # título, `código`).
// Aqui vira trechos de texto com a marca de negrito, sem os símbolos, para a tela não mostrar
// asteriscos. Sem HTML: o texto do modelo nunca entra como marcação.

export type Trecho = { texto: string; negrito: boolean };

export function trechosDoAssistente(bruto: string): Trecho[] {
  const limpo = bruto
    .replace(/^#{1,6}\s+/gm, '') // títulos
    .replace(/`([^`]+)`/g, '$1') // código em linha
    .replace(/^\s*[*-]\s+/gm, '• '); // listas com * ou -
  const trechos: Trecho[] = [];
  const re = /\*\*([^*]+)\*\*|__([^_]+)__/g;
  let ultimo = 0;
  for (const m of limpo.matchAll(re)) {
    if (m.index > ultimo) trechos.push({ texto: limpo.slice(ultimo, m.index), negrito: false });
    trechos.push({ texto: m[1] ?? m[2] ?? '', negrito: true });
    ultimo = m.index + m[0].length;
  }
  if (ultimo < limpo.length) trechos.push({ texto: limpo.slice(ultimo), negrito: false });
  // Asterisco solto (itálico *x*) só some; o texto fica.
  return trechos.map((t) => ({ ...t, texto: t.texto.replace(/\*([^*\n]+)\*/g, '$1') }));
}
