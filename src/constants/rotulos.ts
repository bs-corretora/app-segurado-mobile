// Textos que a tela mostra para cada código da API.
import type {
  MotivoCotacao,
  Produto,
  StatusApolice,
  StatusCotacao,
  StatusIndicacao,
  StatusSinistro,
  TipoSinistro,
} from '../api';

/** Rótulo das abas. */
export const ROTULO_ABA = {
  home: 'Início',
  cotacao: 'Cotação',
  sinistro: 'Sinistro',
  assist: 'Assistência',
  config: 'Configurações',
} as const;

/** Ícone das abas. */
export const ICONE_ABA = {
  home: 'home',
  cotacao: 'quote',
  sinistro: 'alert',
  assist: 'phone',
  config: 'gear',
} as const;

/** Título do cabeçalho das telas internas. */
export const TITULO: Record<string, string> = {
  perfil: 'Meu perfil',
  apolices: 'Minhas apólices',
  apolice: 'Detalhe da apólice',
  'sin-novo': 'Abrir sinistro',
  'sin-ok': 'Sinistro aberto',
  'sin-det': 'Acompanhar sinistro',
  'cot-prod': 'Nova cotação',
  'cot-form': 'Solicitar cotação',
  'cot-det': 'Detalhe da cotação',
  indicar: 'Indique amigos',
  notif: 'Notificações',
  dados: 'Dados cadastrais',
  ajuda: 'Ajuda',
  instalar: 'Instalar o app',
};

export type Status = StatusApolice | StatusSinistro | StatusCotacao | StatusIndicacao;

/** Texto e cor (classe CSS) de cada status. */
export const STATUS: Record<Status, [texto: string, cor: 'ok' | 'warn' | 'err']> = {
  ATIVA: ['Ativa', 'ok'],
  VENCIDA: ['Vencida', 'err'],
  CANCELADA: ['Cancelada', 'err'],
  ABERTO: ['Aberto', 'warn'],
  EM_ANALISE: ['Em análise', 'warn'],
  CONCLUIDO: ['Concluído', 'ok'],
  RECEBIDA: ['Recebida', 'warn'],
  RESPONDIDA: ['Respondida', 'ok'],
  NOVA: ['Nova', 'warn'],
  CONTATADA: ['Contatada', 'warn'],
  CONVERTIDA: ['Convertida', 'ok'],
};

export const PRODUTO: Record<Produto, string> = {
  AUTO: 'Auto',
  RESIDENCIAL: 'Residencial',
  VIDA: 'Vida',
  EMPRESARIAL: 'Empresarial',
};
export const PRODUTOS = Object.keys(PRODUTO) as Produto[];

export const TIPO_SINISTRO: Record<TipoSinistro, string> = {
  COLISAO: 'Colisão',
  ROUBO: 'Roubo ou furto',
  INCENDIO: 'Incêndio',
  DANO_ELETRICO: 'Dano elétrico',
  OUTROS: 'Outro',
};

export const MOTIVO: Record<MotivoCotacao, string> = {
  NOVO: 'Novo seguro',
  RENOVACAO: 'Renovação',
};

// Tipos de cobertura: a spec não os lista; confirmar com a BS Seguros.
export const COBERTURAS: Record<Produto, string[]> = {
  AUTO: ['Colisão', 'Roubo', 'Incêndio', 'Todas as coberturas'],
  RESIDENCIAL: ['Incêndio', 'Roubo', 'Dano elétrico', 'Todas as coberturas'],
  VIDA: ['Cobertura básica', 'Cobertura completa'],
  EMPRESARIAL: ['Cobertura básica', 'Cobertura completa'],
};

/** Nome amigável dos campos livres de uma cotação (`dados`). */
const CAMPO_COTACAO: Record<string, string> = {
  cobertura: 'Tipo de cobertura',
  telefone: 'Telefone para contato',
  detalhes: 'Detalhes do pedido',
  tipo_imovel: 'Tipo de imóvel',
  valor_edificacao: 'Valor da edificação',
  valor_conteudo: 'Valor do conteúdo',
  modelo: 'Modelo',
  ano: 'Ano',
  placa: 'Placa',
  cep: 'CEP',
};
export function rotuloCampoCotacao(chave: string): string {
  const conhecido = CAMPO_COTACAO[chave];
  if (conhecido) return conhecido;
  const t = chave.replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}
