// Conversões entre o formato da API e o que a tela mostra.
import { ErroApi } from './api';
import type { DadosCotacao, Data, DataHora } from './api';

/** Deixa só os dígitos. */
export const soDigitos = (s: string): string => s.replace(/\D/g, '');

/** `2026-03-12` (ou uma data e hora ISO) → `12/03/2026`. */
export function data(valor: Data | DataHora | null | undefined): string {
  if (!valor) return '—';
  // Data sem hora: lida como texto para não "voltar um dia" por causa do fuso.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
}

/** Data e hora ISO → `03/10/2026 às 14:20`, no fuso do aparelho. */
export function dataHora(valor: DataHora | null | undefined): string {
  if (!valor) return '—';
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return '—';
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${d.toLocaleDateString('pt-BR')} às ${hora}`;
}

/** Valor para um `<input type="datetime-local">`: `AAAA-MM-DDTHH:MM`, na hora local. */
export function paraInputDataHora(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const REAL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
/** Aceita número ou texto (o Postgres manda `numeric` como texto). */
export function moeda(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') return '—';
  const n = Number(valor);
  return Number.isFinite(n) ? REAL.format(n) : '—';
}

/** Máscara progressiva enquanto a pessoa digita: `(81) 98888-1111`. */
export function mascaraTelefone(s: string): string {
  const d = soDigitos(s).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Telefone guardado só com dígitos → como mostrar. Também entende 0800. */
export function telefone(valor: string | null | undefined): string {
  if (!valor) return '—';
  const d = soDigitos(valor);
  if (/^0[3589]00\d{7}$/.test(d)) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  if (d.length === 10 || d.length === 11) return mascaraTelefone(d);
  return valor;
}

/** Máscara progressiva do CPF: `529.482.200-84`. */
export function mascaraCpf(s: string): string {
  const d = soDigitos(s).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

/** `{ anos: 3, meses: 5 }` → `3 anos e 5 meses`. Cliente com menos de um mês → `null`. */
export function tempoDeCasa({ anos, meses }: { anos: number; meses: number }): string | null {
  const partes: string[] = [];
  if (anos > 0) partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
  if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
  return partes.length ? partes.join(' e ') : null;
}

/** `Maria Souza` → `Maria`. */
export const primeiroNome = (nome: string | null | undefined): string =>
  (nome ?? '').trim().split(/\s+/)[0] ?? '';

/** `Maria Souza` → `MS`. */
export function iniciais(nome: string | null | undefined): string {
  const p = (nome ?? '').trim().split(/\s+/).filter(Boolean);
  const primeira = p[0]?.[0] ?? '';
  const ultima = p.length > 1 ? (p[p.length - 1]?.[0] ?? '') : '';
  return (primeira + ultima).toUpperCase();
}

/** Valor de um campo livre da cotação, pronto para mostrar. */
export function valorCampoCotacao(chave: string, valor: DadosCotacao[string]): string {
  if (valor === null || valor === '') return '—';
  if (typeof valor === 'boolean') return valor ? 'Sim' : 'Não';
  if (chave === 'telefone') return telefone(String(valor));
  if (typeof valor === 'number') {
    if (chave.startsWith('valor')) return moeda(valor);
    // Ano sem separador de milhar: 2024, não 2.024.
    if (/(^|_)ano($|_)/.test(chave)) return String(valor);
    return valor.toLocaleString('pt-BR');
  }
  // Texto curto (ex.: "casa") ganha inicial maiúscula; o texto livre fica como foi escrito.
  return chave === 'detalhes' ? valor : valor.charAt(0).toUpperCase() + valor.slice(1);
}

/**
 * Mensagem de erro de um campo (400 da API) em linguagem de gente:
 * `data_nascimento deve estar no formato AAAA-MM-DD` → `Informe uma data válida.`
 */
export function mensagemDeCampo(campo: string, mensagem: string): string {
  if (/AAAA-MM-DD|formato de data|invalid date/i.test(mensagem)) return 'Informe uma data válida.';
  if (/10 ou 11 d[ií]gitos/i.test(mensagem)) return 'Informe o telefone com DDD.';
  if (/invalid (guid|uuid)/i.test(mensagem)) return 'Escolha uma das opções.';
  if (/^required$|obrigat[óo]rio/i.test(mensagem)) return 'Campo obrigatório.';
  // "data_ocorrencia não pode ser futura" → "Não pode ser futura"
  const sem = mensagem.startsWith(`${campo} `) ? mensagem.slice(campo.length + 1) : mensagem;
  return sem.charAt(0).toUpperCase() + sem.slice(1);
}

/** Mensagem para a pessoa a partir de qualquer erro de chamada à API. */
export function mensagemDeErro(e: unknown): string {
  if (e instanceof ErroApi) {
    switch (e.status) {
      case 404:
        return 'Não encontramos este registro.';
      case 429:
        return 'Muitas tentativas. Espere um minuto e tente de novo.';
      case 503:
        return 'O serviço está fora do ar agora. Tente de novo em instantes.';
      default:
        if (e.status >= 500) return 'Algo deu errado do nosso lado. Tente de novo em instantes.';
        if (e.erro === 'VALIDACAO' && Object.keys(e.campos).length)
          return 'Confira os campos destacados.';
        return e.message;
    }
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false)
    return 'Você está sem internet. Conecte-se e tente de novo.';
  return 'Não foi possível conectar. Verifique sua internet e tente de novo.';
}
