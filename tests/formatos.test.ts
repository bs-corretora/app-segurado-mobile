import { describe, expect, it } from 'vitest';
import { ErroApi } from '../src/api';
import {
  data,
  iniciais,
  mascaraCpf,
  mascaraTelefone,
  mensagemDeCampo,
  mensagemDeErro,
  moeda,
  paraInputDataHora,
  primeiroNome,
  soDigitos,
  telefone,
  tempoDeCasa,
  valorCampoCotacao,
} from '../src/utils/formatos';
import { rotuloApolice } from '../src/utils/rotuloApolice';

// O Intl separa "R$" do número com espaço sem quebra (U+00A0); \s também o reconhece.
const semNbsp = (s: string) => s.replace(/\s/g, ' ');

describe('datas', () => {
  it('data sem hora não "volta um dia" por causa do fuso', () => {
    expect(data('2026-03-12')).toBe('12/03/2026');
    expect(data('2027-01-01')).toBe('01/01/2027');
  });
  it('vazio ou inválido vira travessão', () => {
    expect(data(null)).toBe('—');
    expect(data('não é data')).toBe('—');
  });
  it('valor do input datetime-local na hora local', () => {
    expect(paraInputDataHora(new Date(2026, 9, 3, 7, 5))).toBe('2026-10-03T07:05');
  });
});

describe('moeda', () => {
  it('aceita número e texto (numeric do Postgres)', () => {
    expect(semNbsp(moeda(2400))).toBe('R$ 2.400,00');
    expect(semNbsp(moeda('478.8'))).toBe('R$ 478,80');
  });
  it('sem valor vira travessão', () => {
    expect(moeda(null)).toBe('—');
    expect(moeda('')).toBe('—');
    expect(moeda('abc')).toBe('—');
  });
});

describe('telefone e CPF', () => {
  it('máscara progressiva do telefone', () => {
    expect(mascaraTelefone('8')).toBe('(8');
    expect(mascaraTelefone('819')).toBe('(81) 9');
    expect(mascaraTelefone('8133334444')).toBe('(81) 3333-4444');
    expect(mascaraTelefone('81988881111')).toBe('(81) 98888-1111');
    expect(mascaraTelefone('819888811112222')).toBe('(81) 98888-1111');
  });
  it('mostra telefone guardado só com dígitos, inclusive 0800', () => {
    expect(telefone('81988881111')).toBe('(81) 98888-1111');
    expect(telefone('08008009000')).toBe('0800 800 9000');
    expect(telefone(null)).toBe('—');
  });
  it('máscara progressiva do CPF', () => {
    expect(mascaraCpf('529')).toBe('529');
    expect(mascaraCpf('5294')).toBe('529.4');
    expect(mascaraCpf('529482200')).toBe('529.482.200');
    expect(mascaraCpf('5294822008')).toBe('529.482.200-8');
    expect(mascaraCpf('52948220084')).toBe('529.482.200-84');
    expect(soDigitos(mascaraCpf('52948220084'))).toBe('52948220084');
  });
});

describe('textos do início', () => {
  it('tempo de casa', () => {
    expect(tempoDeCasa({ anos: 3, meses: 5 })).toBe('3 anos e 5 meses');
    expect(tempoDeCasa({ anos: 1, meses: 1 })).toBe('1 ano e 1 mês');
    expect(tempoDeCasa({ anos: 2, meses: 0 })).toBe('2 anos');
    expect(tempoDeCasa({ anos: 0, meses: 0 })).toBeNull();
  });
  it('nome e iniciais', () => {
    expect(primeiroNome('  Maria Souza ')).toBe('Maria');
    expect(iniciais('Maria da Silva Souza')).toBe('MS');
    expect(iniciais('Ana')).toBe('A');
    expect(iniciais('')).toBe('');
  });
});

describe('campos livres da cotação', () => {
  it('formata cada tipo de valor', () => {
    expect(semNbsp(valorCampoCotacao('valor_edificacao', 350000))).toBe('R$ 350.000,00');
    expect(valorCampoCotacao('ano', 2024)).toBe('2024');
    expect(valorCampoCotacao('area_m2', 1200)).toBe('1.200');
    expect(valorCampoCotacao('garagem', true)).toBe('Sim');
    expect(valorCampoCotacao('telefone', '81988881111')).toBe('(81) 98888-1111');
    expect(valorCampoCotacao('tipo_imovel', 'casa')).toBe('Casa');
    expect(valorCampoCotacao('detalhes', 'quero cotar')).toBe('quero cotar');
    expect(valorCampoCotacao('x', null)).toBe('—');
  });
});

describe('mensagens de erro', () => {
  it('erro de campo em linguagem de gente', () => {
    expect(
      mensagemDeCampo('data_nascimento', 'data_nascimento deve estar no formato AAAA-MM-DD'),
    ).toBe('Informe uma data válida.');
    expect(mensagemDeCampo('telefone', 'telefone deve ter 10 ou 11 dígitos, só números')).toBe(
      'Informe o telefone com DDD.',
    );
    expect(mensagemDeCampo('apolice_id', 'Invalid GUID')).toBe('Escolha uma das opções.');
    expect(mensagemDeCampo('data_ocorrencia', 'data_ocorrencia não pode ser futura')).toBe(
      'Não pode ser futura',
    );
    expect(mensagemDeCampo('cpf', 'CPF inválido')).toBe('CPF inválido');
  });

  it('erro geral por status', () => {
    expect(mensagemDeErro(new ErroApi(401, { mensagem: 'E-mail ou senha inválidos' }))).toBe(
      'E-mail ou senha inválidos',
    );
    expect(mensagemDeErro(new ErroApi(409, { mensagem: 'Apólice vencida' }))).toBe(
      'Apólice vencida',
    );
    expect(mensagemDeErro(new ErroApi(429, null))).toMatch(/Espere um minuto/);
    expect(mensagemDeErro(new ErroApi(503, null))).toMatch(/fora do ar/);
    expect(mensagemDeErro(new ErroApi(500, null))).toMatch(/nosso lado/);
    expect(mensagemDeErro(new ErroApi(404, null))).toBe('Não encontramos este registro.');
    expect(
      mensagemDeErro(
        new ErroApi(400, { erro: 'VALIDACAO', mensagem: 'cpf inválido', campos: { cpf: 'x' } }),
      ),
    ).toBe('Confira os campos destacados.');
  });

  it('falha de rede vira mensagem de conexão', () => {
    expect(mensagemDeErro(new TypeError('Failed to fetch'))).toMatch(/conectar|internet/);
  });
});

describe('rotuloApolice', () => {
  it('RF-03: apólice no seletor do sinistro mostra produto e número', () => {
    expect(
      rotuloApolice({
        id: 'a1',
        produto: 'AUTO',
        numero: 'AU-2026-004821',
        status: 'ATIVA',
        inicio_vigencia: '2026-01-10',
        fim_vigencia: '2027-01-10',
      }),
    ).toBe('Auto — AU-2026-004821');
  });
});
