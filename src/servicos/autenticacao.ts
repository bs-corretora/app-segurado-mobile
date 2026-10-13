import { seguradoMock } from '@/dados/mock';
import type { Segurado } from '@/tipos/segurado';

// TODO: trocar a simulação pela chamada real quando o endpoint de login da API estiver definido.
// Exemplo: return requisicao<Segurado>('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
export async function entrar(email: string, senha: string): Promise<Segurado> {
  await esperar(600);
  if (!email || !senha) throw new Error('Informe e-mail e senha.');
  return seguradoMock;
}

// TODO: chamar o endpoint de logout da API para encerrar o cookie de sessão.
// Exemplo: await requisicao('/auth/logout', { method: 'POST' });
export async function sair(): Promise<void> {
  await esperar(300);
}

function esperar(ms: number) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}
