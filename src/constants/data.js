// Dados fictícios do protótipo.
export const TL = { home: 'Início', cotacao: 'Cotação', sinistro: 'Sinistro', assist: 'Assistência', config: 'Configurações' }
export const TI = { home: 'home', cotacao: 'quote', sinistro: 'alert', assist: 'phone', config: 'gear' }
export const TT = {
  perfil: 'Meu perfil', apolices: 'Minhas apólices', apolice: 'Detalhe da apólice', pdf: 'Apólice em PDF',
  'sin-novo': 'Abrir sinistro', 'sin-ok': 'Sinistro aberto', 'sin-det': 'Acompanhar sinistro',
  'cot-prod': 'Nova cotação', 'cot-form': 'Solicitar cotação', 'cot-det': 'Detalhe da cotação',
  indicar: 'Indique amigos', notif: 'Notificações', dados: 'Dados cadastrais', ajuda: 'Ajuda',
}
export const ST = {
  ATIVA: ['Ativa', 'ok'], VENCIDA: ['Vencida', 'err'], ABERTO: ['Aberto', 'warn'], EM_ANALISE: ['Em análise', 'warn'],
  CONCLUIDO: ['Concluído', 'ok'], RECEBIDA: ['Recebida', 'warn'], RESPONDIDA: ['Respondida', 'ok'],
  NOVA: ['Nova', 'warn'], CONTATADA: ['Contatada', 'warn'], CONVERTIDA: ['Convertida', 'ok'],
}
export const POL = [
  { id: 0, p: 'Auto', n: 'AU-2026-004821', s: 'ATIVA', v: '12/03/2026 a 12/03/2027', pr: 'R$ 3.480,00' },
  { id: 1, p: 'Vida', n: 'VI-2023-000316', s: 'ATIVA', v: '05/06/2026 a 05/06/2027', pr: 'R$ 960,00' },
  { id: 2, p: 'Residencial', n: 'RE-2025-001937', s: 'VENCIDA', v: '02/08/2025 a 02/08/2026', pr: 'R$ 1.120,00' },
]
export const NOT = [
  { t: 'Seu sinistro mudou de status', m: 'SIN-2026-000123 está em análise.', d: ['sin-det'], u: 1 },
  { t: 'Sua cotação foi respondida', m: 'Veja a resposta para o seguro Residencial.', d: ['cot-det', 0], u: 1 },
  { t: 'Renovação em 30 dias', m: 'A apólice Vida vence em 05/06/2027.', d: ['apolice', 1], u: 0 },
  { t: 'Campanha de fim de ano', m: 'Fale com a BS Seguros e conheça as condições.', d: ['home'], u: 0 },
]
// Tipos de cobertura: a spec não os lista; confirmar com a BS Seguros.
export const COB = {
  Auto: ['Colisão', 'Roubo', 'Incêndio', 'Todas as coberturas'],
  Residencial: ['Incêndio', 'Roubo', 'Dano elétrico', 'Todas as coberturas'],
  Vida: ['Cobertura básica', 'Cobertura completa'],
  Empresarial: ['Cobertura básica', 'Cobertura completa'],
}
