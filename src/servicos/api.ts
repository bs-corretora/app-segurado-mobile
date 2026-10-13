// Cliente HTTP da API (app-segurado-api).
// A sessão fica num cookie HttpOnly emitido pela API, por isso `credentials: 'include'`:
// o app nunca guarda token.
const URL_API = process.env.EXPO_PUBLIC_API_URL;

export class ErroApi extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  if (!URL_API) {
    throw new Error('EXPO_PUBLIC_API_URL não definida. Copie .env.example para .env.');
  }

  const resposta = await fetch(`${URL_API}${caminho}`, {
    ...opcoes,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...opcoes.headers },
  });

  if (!resposta.ok) {
    throw new ErroApi(resposta.status, `Erro ${resposta.status} ao acessar ${caminho}`);
  }

  return (await resposta.json()) as T;
}
