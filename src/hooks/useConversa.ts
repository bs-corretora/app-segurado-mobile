// Conversa com o assistente: histórico só na memória da tela (some ao sair), "digitando" enquanto
// espera e erro com "tentar de novo". A lógica fica em `criarConversa`, sem React, para os testes
// de tests/conversa.test.ts; o hook só liga ela à tela.
import { useState, useSyncExternalStore } from 'react';
import { ErroApi, perguntarAssistente } from '../api';
import type { AtalhoAssistente, FonteAssistente, MensagemAssistente } from '../api';
import { mensagemDeErro } from '../utils/formatos';

/** Quantas mensagens recentes vão em cada pergunta (limite da API). */
export const MAX_HISTORICO = 10;
/** Tamanho máximo de cada texto aceito pela API. */
export const MAX_TEXTO = 4000;

export type MensagemConversa = MensagemAssistente & {
  id: number;
  fontes?: FonteAssistente[];
  atalhos?: AtalhoAssistente[];
};

export type EstadoConversa = {
  mensagens: MensagemConversa[];
  esperando: boolean;
  erro: string | null;
};

type Perguntar = typeof perguntarAssistente;

/** As últimas mensagens no formato da API, cada texto dentro do limite. */
export function historicoParaApi(mensagens: readonly MensagemConversa[]): MensagemAssistente[] {
  return mensagens
    .slice(-MAX_HISTORICO)
    .map(({ papel, texto }) => ({ papel, texto: texto.slice(0, MAX_TEXTO) }));
}

export function mensagemDeErroAssistente(e: unknown): string {
  if (e instanceof ErroApi && e.status === 429)
    return 'Você fez muitas perguntas seguidas. Espere alguns minutos e tente de novo.';
  if (e instanceof ErroApi && e.status === 503)
    return 'O assistente está indisponível agora. Tente mais tarde ou fale com a corretora.';
  return mensagemDeErro(e);
}

export function criarConversa(perguntar: Perguntar) {
  let estado: EstadoConversa = { mensagens: [], esperando: false, erro: null };
  let proximoId = 1;
  const ouvintes = new Set<() => void>();

  const mudar = (parcial: Partial<EstadoConversa>) => {
    estado = { ...estado, ...parcial };
    ouvintes.forEach((f) => f());
  };

  async function pedirResposta() {
    mudar({ esperando: true, erro: null });
    try {
      const r = await perguntar(historicoParaApi(estado.mensagens));
      const resposta: MensagemConversa = {
        id: proximoId++,
        papel: 'assistente',
        texto: r.resposta,
        fontes: r.fontes ?? [],
        atalhos: r.atalhos ?? [],
      };
      mudar({ mensagens: [...estado.mensagens, resposta], esperando: false });
    } catch (e) {
      mudar({ esperando: false, erro: mensagemDeErroAssistente(e) });
    }
  }

  return {
    estado: () => estado,
    assinar(f: () => void) {
      ouvintes.add(f);
      return () => void ouvintes.delete(f);
    },
    /** Manda uma pergunta nova. Ignora texto vazio e pergunta enquanto espera a anterior. */
    enviar(texto: string): Promise<void> {
      const limpo = texto.trim().slice(0, MAX_TEXTO);
      if (!limpo || estado.esperando) return Promise.resolve();
      const pergunta: MensagemConversa = { id: proximoId++, papel: 'usuario', texto: limpo };
      mudar({ mensagens: [...estado.mensagens, pergunta] });
      return pedirResposta();
    },
    /** Depois de um erro, pede de novo a resposta da última pergunta. */
    tentarDeNovo(): Promise<void> {
      const ultima = estado.mensagens.at(-1);
      if (estado.esperando || ultima?.papel !== 'usuario') return Promise.resolve();
      return pedirResposta();
    },
  };
}

export type Conversa = ReturnType<typeof criarConversa>;

/** `const c = useConversa()` — `c.mensagens`, `c.esperando`, `c.erro`, `c.enviar(texto)`. */
export function useConversa(perguntar: Perguntar = perguntarAssistente) {
  const [conversa] = useState(() => criarConversa(perguntar));
  const estado = useSyncExternalStore(conversa.assinar, conversa.estado, conversa.estado);
  return { ...estado, enviar: conversa.enviar, tentarDeNovo: conversa.tentarDeNovo };
}
