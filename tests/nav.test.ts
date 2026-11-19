import { describe, expect, it } from 'vitest';
import { navegar, substituir, temOndeVoltar, voltar, type EstadoNav } from '../src/app/nav';

const inicio: EstadoNav = { cur: ['home'], pilha: [] };

describe('navegação por pilha', () => {
  it('telas internas empilham e voltar desempilha', () => {
    let e = navegar(inicio, 'apolices');
    e = navegar(e, 'apolice', 'id-1');
    expect(e.cur).toEqual(['apolice', 'id-1']);
    expect(e.pilha).toEqual([['home'], ['apolices', undefined]]);
    e = voltar(e);
    expect(e.cur).toEqual(['apolices', undefined]);
    e = voltar(e);
    expect(e).toEqual({ cur: ['home'], pilha: [] });
  });

  it('abas e telas de fora zeram a pilha', () => {
    const fundo = navegar(navegar(inicio, 'apolices'), 'apolice', 'x');
    expect(navegar(fundo, 'sinistro')).toEqual({ cur: ['sinistro', undefined], pilha: [] });
    expect(navegar(fundo, 'login')).toEqual({ cur: ['login', undefined], pilha: [] });
  });

  it('aba seguida de tela interna: voltar cai na aba (fluxo após enviar formulário)', () => {
    const e = navegar(navegar(navegar(inicio, 'cot-prod'), 'cotacao'), 'cot-det', 'nova');
    expect(e.pilha).toEqual([['cotacao', undefined]]);
    expect(voltar(e).cur).toEqual(['cotacao', undefined]);
  });

  it('substituir troca a tela sem empilhar', () => {
    const e = substituir(navegar(inicio, 'sin-ok', 'id'), 'sin-det', 'id');
    expect(e).toEqual({ cur: ['sin-det', 'id'], pilha: [['home']] });
  });

  it('sem pilha: de fora volta ao login, de dentro volta ao início', () => {
    expect(voltar({ cur: ['esqueci'], pilha: [] }).cur).toEqual(['login']);
    expect(voltar({ cur: ['config'], pilha: [] }).cur).toEqual(['home']);
  });

  it('botão voltar do aparelho só é segurado quando há para onde voltar', () => {
    expect(temOndeVoltar(inicio)).toBe(false);
    expect(temOndeVoltar({ cur: ['login'], pilha: [] })).toBe(false);
    expect(temOndeVoltar({ cur: ['abrindo'], pilha: [] })).toBe(false);
    expect(temOndeVoltar({ cur: ['config'], pilha: [] })).toBe(true);
    expect(temOndeVoltar({ cur: ['cadastro'], pilha: [] })).toBe(true);
    expect(temOndeVoltar(navegar(inicio, 'notif'))).toBe(true);
  });
});
