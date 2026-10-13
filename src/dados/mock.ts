// Dados falsos usados enquanto a API (app-segurado-api) não está conectada.
// Quando a integração entrar, os serviços em src/servicos deixam de usar este arquivo.
import type { Apolice } from '@/tipos/apolice';
import type { Segurado } from '@/tipos/segurado';

export const seguradoMock: Segurado = {
  id: '1',
  nome: 'Thauan Veiga',
  email: 'thauan@email.com',
  seguradoDesde: '2023-06-10',
};

export const apolicesMock: Apolice[] = [
  {
    id: '1',
    tipo: 'Auto',
    numero: 'AU-2026-004581',
    status: 'ativa',
    inicioVigencia: '2026-10-01',
    fimVigencia: '2027-10-01',
  },
  {
    id: '2',
    tipo: 'Vida',
    numero: 'VI-2026-001273',
    status: 'ativa',
    inicioVigencia: '2026-10-01',
    fimVigencia: '2027-10-01',
  },
];
