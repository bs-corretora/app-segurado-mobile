// Termos de seguro explicados em uma frase, para aparecer na própria tela (#33).
// Mesmo texto do glossário do .specs/DESIGN.md (seção 7).

export const GLOSSARIO = {
  cobertura: 'O que o seguro protege. Ex.: colisão, roubo, incêndio, danos a terceiros.',
  franquia:
    'Valor que você paga em cada sinistro com perda parcial. Ex.: franquia de R$ 1.000 = você paga os primeiros R$ 1.000 do conserto.',
  vigencia: 'Período em que o seguro está ativo. Início e fim das coberturas.',
  premio: 'Valor que você paga pelo seguro (mensal ou anual).',
} as const;

/** Ordem em que os termos aparecem na tela da apólice. */
export const TERMOS_APOLICE: readonly (readonly [termo: string, explicacao: string])[] = [
  ['Cobertura', GLOSSARIO.cobertura],
  ['Franquia', GLOSSARIO.franquia],
  ['Vigência', GLOSSARIO.vigencia],
  ['Prêmio', GLOSSARIO.premio],
];
