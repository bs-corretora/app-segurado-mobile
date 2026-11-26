import { describe, expect, it } from 'vitest';
import {
  compor,
  confirmaSenha,
  obrigatorio,
  opcional,
  textoLivre,
  validadoresPorTipo as v,
  validarTudo,
} from '../src/utils/validacao';

describe('validação dos formulários', () => {
  it('Base (cadastro): nome em branco ou só números pede o nome completo', () => {
    expect(v.nome('')).toBe('Informe seu nome completo.');
    expect(v.nome('   ')).toBe('Informe seu nome completo.');
    expect(v.nome('12345')).toMatch(/^Informe seu nome completo/);
    expect(v.nome('Ana')).toBe('Informe seu nome e sobrenome.');
    expect(v.nome('Ana Souza')).toBeUndefined();
  });

  it('Base (cadastro): CPF confere tamanho e dígito verificador', () => {
    expect(v.cpf('')).toBe('Informe o CPF.');
    expect(v.cpf('123.456.789')).toBe('CPF deve ter 11 dígitos.');
    expect(v.cpf('111.111.111-11')).toBe('CPF inválido.');
    expect(v.cpf('529.982.247-24')).toBe('CPF inválido.');
    expect(v.cpf('529.982.247-25')).toBeUndefined();
    expect(v.cpf('52998224725')).toBeUndefined();
  });

  it('Base (cadastro): e-mail mostra o formato aceito', () => {
    expect(v.email('')).toBe('Informe seu e-mail.');
    expect(v.email('ana@')).toMatch(/ex\.: voce@dominio\.com/);
    expect(v.email(' ana@bs.com.br ')).toBeUndefined();
  });

  it('Base (cadastro): celular com DDD tem 10 ou 11 dígitos', () => {
    expect(v.telefone('')).toBe('Informe o telefone com DDD.');
    expect(v.telefone('9999-9999')).toMatch(/10 ou 11 dígitos/);
    expect(v.telefone('(81) 3333-4444')).toBeUndefined();
    expect(v.telefone('(81) 99999-8888')).toBeUndefined();
  });

  it('Base (cadastro): senha nova tem 8 caracteres ou mais; senha atual só precisa estar preenchida', () => {
    expect(v.senha('')).toBe('Informe a senha.');
    expect(v.senha('1234567')).toMatch(/8 caracteres/);
    expect(v.senha('12345678')).toBeUndefined();
    expect(v.senhaAtual('')).toBe('Informe a senha.');
    expect(v.senhaAtual('123')).toBeUndefined();
  });

  it('Base (cadastro): confirmação precisa ser igual à senha', () => {
    const conferir = confirmaSenha('segredo123');
    expect(conferir('')).toBe('Confirme sua senha.');
    expect(conferir('outra')).toBe('As senhas não coincidem.');
    expect(conferir('segredo123')).toBeUndefined();
  });

  it('RF-03: data da ocorrência precisa existir e não pode ser futura', () => {
    expect(v.dataNaoFutura('')).toBe('Informe a data.');
    expect(v.dataNaoFutura('31/12/2025')).toMatch(/AAAA-MM-DD/);
    expect(v.dataNaoFutura('2025-13-45')).toBe('Informe uma data válida.');
    expect(v.dataNaoFutura('2999-01-01T10:00')).toBe('A data não pode ser no futuro.');
    expect(v.dataNaoFutura('2025-01-01T10:00')).toBeUndefined();
    expect(v.data('2025-01-01')).toBeUndefined();
  });

  it('RF-03: local e descrição são opcionais, mas preenchidos seguem o tamanho', () => {
    const descricao = opcional(textoLivre(10, 2000));
    expect(descricao('')).toBeUndefined();
    expect(descricao('curto')).toBe('Mínimo 10 caracteres.');
    expect(descricao('x'.repeat(2001))).toBe('Máximo 2000 caracteres.');
    expect(descricao('Bati o carro no portão.')).toBeUndefined();
  });

  it('RF-04: texto livre, CEP e placa mostram o formato aceito', () => {
    expect(v.textoCurto('')).toBe('Campo obrigatório.');
    expect(v.textoLongo('pouco')).toBe('Mínimo 10 caracteres.');
    expect(v.cep('')).toBe('Informe o CEP.');
    expect(v.cep('5000')).toMatch(/01234-567/);
    expect(v.cep('50000-000')).toBeUndefined();
    expect(v.placa('')).toBe('Informe a placa do veículo.');
    expect(v.placa('AB-12')).toMatch(/ABC-1234 ou ABC1D23/);
    expect(v.placa('abc-1234')).toBeUndefined();
    expect(v.placa('ABC1D23')).toBeUndefined();
  });

  it('compor devolve o primeiro erro e obrigatorio recusa só espaços', () => {
    const regra = compor(obrigatorio, textoLivre(3, 5));
    expect(regra('  ')).toBe('Campo obrigatório.');
    expect(regra('abcdef')).toBe('Máximo 5 caracteres.');
    expect(regra('abcd')).toBeUndefined();
  });

  it('Base: validarTudo devolve só os campos com erro, no formato do useEnvio', () => {
    expect(
      validarTudo({
        nome: ['', v.nome],
        email: ['ana@bs.com', v.email],
        senha: ['123', v.senha],
      }),
    ).toEqual({
      nome: 'Informe seu nome completo.',
      senha: 'A senha precisa de 8 caracteres ou mais.',
    });
    expect(validarTudo({ email: ['ana@bs.com', v.email] })).toEqual({});
  });
});
