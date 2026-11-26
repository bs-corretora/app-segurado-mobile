// Validações client-side reutilizáveis para todos os formulários.
export type Validador = (valor: string) => string | undefined; // undefined = válido, string = mensagem de erro

/** Valida se o campo está preenchido (não vazio, não apenas espaços). */
export const obrigatorio: Validador = (valor) => (valor.trim() ? undefined : 'Campo obrigatório.');

/** Valida nome completo: não vazio, não apenas números, mínimo 2 partes (nome e sobrenome). */
export const nomeCompleto: Validador = (valor) => {
  const v = valor.trim();
  if (!v) return 'Informe seu nome completo.';
  if (/^\d+$/.test(v)) return 'Informe seu nome completo (não apenas números).';
  const partes = v.split(/\s+/).filter(Boolean);
  if (partes.length < 2) return 'Informe seu nome e sobrenome.';
  if (v.length < 3) return 'Nome muito curto.';
  return undefined;
};

/** Valida e-mail no formato padrão. */
export const email: Validador = (valor) => {
  const v = valor.trim();
  if (!v) return 'Informe seu e-mail.';
  // RFC 5322 simplificado
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return 'Informe um e-mail válido (ex.: voce@dominio.com).';
  return undefined;
};

/** Valida CPF (11 dígitos, com ou sem formatação). */
export const cpf: Validador = (valor) => {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return 'Informe o CPF.';
  if (digitos.length !== 11) return 'CPF deve ter 11 dígitos.';
  // Validação do dígito verificador
  if (/^(\d)\1{10}$/.test(digitos)) return 'CPF inválido.';
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(digitos[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(digitos[9])) return 'CPF inválido.';
  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(digitos[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(digitos[10])) return 'CPF inválido.';
  return undefined;
};

/** Valida telefone brasileiro (10 ou 11 dígitos com DDD). */
export const telefone: Validador = (valor) => {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return 'Informe o telefone com DDD.';
  if (digitos.length !== 10 && digitos.length !== 11)
    return 'Informe o telefone com DDD (10 ou 11 dígitos).';
  return undefined;
};

/** Valida CEP (8 dígitos). */
export const cep: Validador = (valor) => {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return 'Informe o CEP.';
  if (digitos.length !== 8) return 'CEP deve ter 8 dígitos (ex.: 01234-567).';
  return undefined;
};

/** Valida placa veicular (formato antigo AAA-9999 ou Mercosul AAA9A99). */
export const placa: Validador = (valor) => {
  const v = valor
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (!v) return 'Informe a placa do veículo.';
  // AAA-9999 (antigo) = 7 chars | AAA9A99 (Mercosul) = 7 chars
  if (v.length !== 7) return 'Placa deve ter 7 caracteres (ex.: ABC-1234 ou ABC1D23).';
  return undefined;
};

/** Valida data no formato ISO (YYYY-MM-DD) ou datetime-local (YYYY-MM-DDTHH:MM). */
export const data: Validador = (valor) => {
  const v = valor.trim();
  if (!v) return 'Informe a data.';
  // Aceita YYYY-MM-DD ou YYYY-MM-DDTHH:MM
  if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(v)) return 'Informe uma data válida (AAAA-MM-DD).';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return 'Informe uma data válida.';
  return undefined;
};

/** Valida que a data não é futura. */
export const dataNaoFutura: Validador = (valor) => {
  const erroData = data(valor);
  if (erroData) return erroData;
  const d = new Date(valor);
  if (d > new Date()) return 'A data não pode ser no futuro.';
  return undefined;
};

/** Valida senha: mínimo 8 caracteres. */
export const senhaMin8: Validador = (valor) => {
  if (!valor) return 'Informe a senha.';
  if (valor.length < 8) return 'A senha precisa de 8 caracteres ou mais.';
  return undefined;
};

/** Valida confirmação de senha (precisa do valor da senha original). */
export const confirmaSenha =
  (senhaOriginal: string): Validador =>
  (valor) => {
    if (!valor) return 'Confirme sua senha.';
    if (valor !== senhaOriginal) return 'As senhas não coincidem.';
    return undefined;
  };

/** Valida texto livre com tamanho mínimo e máximo. */
export const textoLivre =
  (min: number, max: number): Validador =>
  (valor) => {
    const v = valor.trim();
    if (!v) return 'Campo obrigatório.';
    if (v.length < min) return `Mínimo ${min} caracteres.`;
    if (v.length > max) return `Máximo ${max} caracteres.`;
    return undefined;
  };

/** Compositor: executa múltiplos validadores em sequência, retorna o primeiro erro. */
export const compor =
  (...validadores: Validador[]): Validador =>
  (valor) => {
    for (const v of validadores) {
      const erro = v(valor);
      if (erro) return erro;
    }
    return undefined;
  };

/** Campo opcional: vazio passa; preenchido, segue a regra. */
export const opcional =
  (validador: Validador): Validador =>
  (valor) =>
    valor.trim() ? validador(valor) : undefined;

/**
 * Roda as regras de um formulário inteiro na hora de enviar.
 * Recebe `{ campo: [valor, validador] }` e devolve só os campos com erro,
 * no formato que o `useEnvio().enviar(acao, validar)` espera.
 */
export function validarTudo(
  regras: Record<string, readonly [valor: string, validador: Validador]>,
): Record<string, string> {
  const erros: Record<string, string> = {};
  for (const [campo, [valor, validador]] of Object.entries(regras)) {
    const erro = validador(valor);
    if (erro) erros[campo] = erro;
  }
  return erros;
}

/**
 * Validadores prontos por tipo de campo. Cada um já trata o vazio com a própria
 * mensagem (ex.: "Informe seu nome completo."), por isso não passam pelo `obrigatorio`.
 */
export const validadoresPorTipo = {
  nome: nomeCompleto,
  email,
  cpf,
  telefone,
  cep,
  placa,
  data,
  dataNaoFutura,
  senha: senhaMin8,
  /** Login e senha atual: só exige preenchido (contas antigas podem ter senha mais curta). */
  senhaAtual: (valor: string) => (valor ? undefined : 'Informe a senha.'),
  textoCurto: textoLivre(5, 200),
  textoLongo: textoLivre(10, 2000),
} as const;
