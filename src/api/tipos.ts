// Formato das respostas da API do App do Segurado.
// Fonte: Swagger em https://app-segurado-api.onrender.com/api/docs, conferido contra a API
// publicada em 18/11/2026. Mudou a API? Atualize aqui no mesmo PR.

/** UUID (texto). */
export type Id = string;
/** Data sem hora, `AAAA-MM-DD`. */
export type Data = string;
/** Data e hora ISO 8601 com fuso, ex.: `2026-11-05T22:00:00+00:00`. */
export type DataHora = string;

export type Produto = 'AUTO' | 'RESIDENCIAL' | 'VIDA' | 'EMPRESARIAL';
export type StatusApolice = 'ATIVA' | 'VENCIDA' | 'CANCELADA';
export type TipoSinistro = 'COLISAO' | 'ROUBO' | 'INCENDIO' | 'DANO_ELETRICO' | 'OUTROS';
export type StatusSinistro = 'ABERTO' | 'EM_ANALISE' | 'CONCLUIDO';
export type MotivoCotacao = 'NOVO' | 'RENOVACAO';
export type StatusCotacao = 'RECEBIDA' | 'EM_ANALISE' | 'RESPONDIDA';
export type StatusIndicacao = 'NOVA' | 'CONTATADA' | 'CONVERTIDA';
export type TipoContato = 'ASSISTENCIA_24H' | 'SINISTRO';
export type TipoNotificacao = 'MARKETING' | 'ANIVERSARIO' | 'SISTEMA';
export type DestinoNotificacao = 'SINISTRO' | 'COTACAO' | 'APOLICE';

/** Toda lista da API vem paginada assim. `?pagina=2&limite=20` (limite máximo 50). */
export type Pagina<T> = { itens: T[]; pagina: number; limite: number; total: number };

/** Corpo de qualquer erro da API. */
export type CorpoErro = {
  status: number;
  erro:
    | 'VALIDACAO'
    | 'NAO_AUTENTICADO'
    | 'SEM_PERMISSAO'
    | 'NAO_ENCONTRADO'
    | 'CONFLITO'
    | 'LIMITE_EXCEDIDO'
    | 'INDISPONIVEL'
    /** 403 no login de conta que ainda não confirmou o e-mail. */
    | 'EMAIL_NAO_CONFIRMADO'
    | string;
  mensagem: string;
  /** Nos erros 400: mensagem por campo, ex.: `{ cpf: 'CPF inválido' }`. */
  campos?: Record<string, string>;
};

// ----- Autenticação ----------------------------------------------------------

export type Tokens = {
  access_token: string;
  refresh_token: string;
  /** Segundos (3600). */
  expires_in: number;
  /** Epoch em segundos. */
  expires_at: number;
};

export type RespostaLogin = Tokens & { id: Id; email: string };
/** O cadastro não inicia sessão: o código de 6 dígitos chega por e-mail e vai em `confirmarEmail`. */
export type RespostaCadastro = { id: Id; apolices_vinculadas: number; confirmar_email: true };

export type NovoCadastro = {
  nome: string;
  /** Com ou sem pontuação. */
  cpf: string;
  email: string;
  /** Só dígitos, 10 ou 11. */
  telefone: string;
  data_nascimento: Data;
  /** Mínimo 8 caracteres. */
  senha: string;
  /** Opcional, ex.: `AU-2026-004821`. Com ele, as apólices do mesmo CPF já vêm vinculadas. */
  numero_apolice?: string;
  aceite_termos: true;
  /** Opcional: se o usuário quer receber novidades por e-mail/notificação. */
  aceita_marketing?: boolean;
};

// ----- Perfil e início -------------------------------------------------------

export type Perfil = {
  id: Id;
  nome: string;
  cpf: string;
  telefone: string | null;
  data_nascimento: Data;
  cliente_desde: Data | null;
  papel: 'SEGURADO' | 'ADMIN';
  codigo_indicacao: string;
  aceita_marketing: boolean;
  termos_aceitos_em: DataHora | null;
  criado_em: DataHora;
  email: string;
};

/** Só estes dois campos são editáveis pelo segurado. */
export type AtualizarPerfil = { telefone?: string | null; aceita_marketing?: boolean };

export type Dashboard = {
  nome: string;
  iniciais: string;
  tempo_de_casa: { anos: number; meses: number };
  aniversario_hoje: boolean;
  nao_lidas: number;
  apolices_ativas: ApoliceResumo[];
};

// ----- Apólices --------------------------------------------------------------

export type ApoliceResumo = {
  id: Id;
  produto: Produto;
  numero: string;
  status: StatusApolice;
  inicio_vigencia: Data;
  fim_vigencia: Data;
};

export type Apolice = ApoliceResumo & {
  premio: number | null;
  /** A API ainda não detalha coberturas: vem sempre vazio. */
  coberturas: unknown[];
};

/** Link assinado do PDF: vale 60 segundos, abrir na hora. */
export type LinkPdf = { url: string; expira_em: DataHora };

// ----- Contatos --------------------------------------------------------------

export type Contato = {
  id: Id;
  tipo: TipoContato;
  /** `null` = vale para todos os produtos. */
  produto: Produto | null;
  rotulo: string;
  telefone: string | null;
  whatsapp: string | null;
};

// ----- Sinistros -------------------------------------------------------------

export type SinistroResumo = {
  id: Id;
  protocolo: string;
  tipo: TipoSinistro;
  status: StatusSinistro;
  data_ocorrencia: DataHora;
  apolice_id: Id;
  criado_em: DataHora;
};

export type EventoSinistro = {
  id: Id;
  status: StatusSinistro;
  comentario: string | null;
  criado_em: DataHora;
};

export type Sinistro = SinistroResumo & {
  local: string | null;
  descricao: string | null;
  atualizado_em: DataHora;
  /** Linha do tempo, do mais antigo para o mais novo. */
  eventos: EventoSinistro[];
};

export type NovoSinistro = {
  /** Só apólice ATIVA do segurado. */
  apolice_id: Id;
  tipo: TipoSinistro;
  /** ISO com fuso e não pode ser futura: `new Date(valorDoInput).toISOString()`. */
  data_ocorrencia: DataHora;
  local?: string;
  descricao?: string;
};

/** Resposta do POST /sinistros (sem a linha do tempo). */
export type SinistroCriado = SinistroResumo & { local: string | null; descricao: string | null };

// ----- Cotações --------------------------------------------------------------

/** Campos livres do formulário: texto, número, sim/não; até 30 campos e 4 KB. */
export type DadosCotacao = Record<string, string | number | boolean | null>;

export type Cotacao = {
  id: Id;
  produto: Produto;
  motivo: MotivoCotacao;
  dados: DadosCotacao | null;
  status: StatusCotacao;
  resposta: string | null;
  /** Pode chegar como texto (coluna numeric do Postgres): use `Number(valor_estimado)`. */
  valor_estimado: number | string | null;
  respondida_em: DataHora | null;
  criado_em: DataHora;
};

export type NovaCotacao = { produto: Produto; motivo: MotivoCotacao; dados?: DadosCotacao };

// ----- Indicações ------------------------------------------------------------

export type LinkIndicacao = { codigo: string; link: string };
export type Indicacao = { id: Id; nome: string; status: StatusIndicacao; criado_em: DataHora };

// ----- Notificações ----------------------------------------------------------

export type Notificacao = {
  id: Id;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  /** Para onde levar ao tocar (com `destino_id`), ou `null`. */
  destino_tipo: DestinoNotificacao | null;
  destino_id: Id | null;
  lida_em: DataHora | null;
  criado_em: DataHora;
};

// ----- Assistente ------------------------------------------------------------

export type PapelMensagem = 'usuario' | 'assistente';

/** Uma mensagem do histórico enviado ao assistente (texto de 1 a 4000 caracteres). */
export type MensagemAssistente = { papel: PapelMensagem; texto: string };

/** Trecho da base de conhecimento usado na resposta. */
export type FonteAssistente = { id: string; titulo: string };

/** Botão sugerido na resposta. `tela` é um caminho no estilo web (`/apolices/:id`). */
export type AtalhoAssistente = { rotulo: string; tela: string; id?: string };

export type RespostaAssistente = {
  resposta: string;
  fontes: FonteAssistente[];
  atalhos: AtalhoAssistente[];
};
