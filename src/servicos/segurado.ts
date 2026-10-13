import { apolicesMock, seguradoMock } from '@/dados/mock';
import type { Apolice } from '@/tipos/apolice';
import type { Segurado } from '@/tipos/segurado';

// TODO: trocar os dados falsos pelas chamadas reais à API (ver src/servicos/api.ts).

export async function buscarSegurado(): Promise<Segurado> {
  return seguradoMock;
}

export async function buscarApolicesAtivas(): Promise<Apolice[]> {
  return apolicesMock.filter((apolice) => apolice.status === 'ativa');
}
