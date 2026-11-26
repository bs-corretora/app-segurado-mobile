// Regras da confirmação de e-mail que não dependem de tela: formato do código, espera entre
// reenvios e o que fica guardado no navegador para a tela do código sobreviver a um refresh.

export const TAMANHO_CODIGO = 6;
export const ESPERA_REENVIO_S = 60;

const CHAVE = 'confirmar_email';

/** Só os dígitos, no máximo 6: aceita colar "123 456" ou "123-456". */
export const limparCodigo = (v: string): string => v.replace(/\D/g, '').slice(0, TAMANHO_CODIGO);

export const codigoCompleto = (v: string): boolean => v.length === TAMANHO_CODIGO;

/** Segundos que faltam para liberar o reenvio (0 = liberado). */
export function segundosRestantes(liberaEm: number, agora: number = Date.now()): number {
  return Math.max(0, Math.ceil((liberaEm - agora) / 1000));
}

export type Pendente = {
  email: string;
  /** Conta recém-criada: depois de confirmar, mostra a boas-vindas. */
  novo: boolean;
  /** Epoch em ms em que o botão "Reenviar código" volta a valer. */
  liberaEm: number;
};

/** Anota que esta aba está confirmando `email`. Começa a espera do reenvio agora. */
export function guardarPendente(email: string, novo: boolean): Pendente {
  const p: Pendente = { email, novo, liberaEm: Date.now() + ESPERA_REENVIO_S * 1000 };
  salvar(p);
  return p;
}

export function salvar(p: Pendente): void {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(p));
  } catch {
    // Sem sessionStorage (aba privada bloqueada): a tela segue com o e-mail da navegação.
  }
}

export function lerPendente(): Pendente | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE);
    if (!bruto) return null;
    const p = JSON.parse(bruto) as Partial<Pendente>;
    if (typeof p.email !== 'string' || !p.email) return null;
    return {
      email: p.email,
      novo: p.novo === true,
      liberaEm: typeof p.liberaEm === 'number' ? p.liberaEm : 0,
    };
  } catch {
    return null;
  }
}

export function limparPendente(): void {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    // nada a limpar
  }
}
