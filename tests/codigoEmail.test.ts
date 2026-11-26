import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ESPERA_REENVIO_S,
  codigoCompleto,
  guardarPendente,
  lerPendente,
  limparCodigo,
  limparPendente,
  segundosRestantes,
} from '../src/utils/codigoEmail';

beforeEach(() => {
  const m = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
  });
});

describe('código de confirmação de e-mail', () => {
  it('RF-01: aceita colar com espaço ou traço e corta em 6 dígitos', () => {
    expect(limparCodigo('123 456')).toBe('123456');
    expect(limparCodigo('12-34-56')).toBe('123456');
    expect(limparCodigo('abc1234567')).toBe('123456');
    expect(limparCodigo('')).toBe('');
  });

  it('RF-01: só libera o envio com exatamente 6 dígitos', () => {
    expect(codigoCompleto('12345')).toBe(false);
    expect(codigoCompleto('123456')).toBe(true);
  });

  it('RF-01: a espera do reenvio conta de 60 s até zero e nunca fica negativa', () => {
    expect(segundosRestantes(60_000, 0)).toBe(60);
    expect(segundosRestantes(60_000, 59_100)).toBe(1);
    expect(segundosRestantes(60_000, 60_000)).toBe(0);
    expect(segundosRestantes(60_000, 90_000)).toBe(0);
  });

  it('RF-01: o e-mail pendente sobrevive a um refresh e some ao limpar', () => {
    const antes = Date.now();
    const p = guardarPendente('a@b.c', true);
    expect(p.liberaEm).toBeGreaterThanOrEqual(antes + ESPERA_REENVIO_S * 1000);
    expect(lerPendente()).toEqual(p);
    limparPendente();
    expect(lerPendente()).toBeNull();
  });

  it('RF-01: dado corrompido na aba vira "sem pendência"', () => {
    sessionStorage.setItem('confirmar_email', '{quebrado');
    expect(lerPendente()).toBeNull();
    sessionStorage.setItem('confirmar_email', JSON.stringify({ novo: true }));
    expect(lerPendente()).toBeNull();
  });
});
