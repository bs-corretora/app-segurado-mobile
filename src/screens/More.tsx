import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  atualizarPerfil,
  buscarLinkIndicacao,
  buscarPerfil,
  listarContatos,
  listarIndicacoes,
  listarNotificacoes,
  marcarNotificacaoLida,
  sair,
  trocarSenha,
  type Notificacao,
  type Perfil as PerfilApi,
} from '../api';
import { useNav } from '../nav';
import { useSessao } from '../sessao';
import { useApi, usePaginado } from '../hooks/useApi';
import { useEnvio } from '../hooks/useEnvio';
import { useInstalacao } from '../pwa/instalacao';
import {
  data,
  dataHora,
  iniciais,
  mascaraCpf,
  mascaraTelefone,
  soDigitos,
  telefone,
} from '../formatos';
import {
  Aviso,
  Avatar,
  Botao,
  Caixa,
  Campo,
  Card,
  ComDados,
  Contato,
  Icon,
  KV,
  MaisItens,
  Tag,
  Vazio,
} from '../ui';

/** Copia para a área de transferência; devolve `false` se o navegador não deixar. */
async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

export function Indicar() {
  const link = useApi(buscarLinkIndicacao);
  const r = usePaginado(listarIndicacoes);
  const [aviso, setAviso] = useState<string | null>(null);

  const aoCopiar = async (url: string) =>
    setAviso(
      (await copiar(url)) ? 'Link copiado.' : 'Não deu para copiar. Selecione o link acima.',
    );

  const aoCompartilhar = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BS Seguros',
          text: 'Faça sua cotação de seguro com a BS Seguros:',
          url,
        });
      } catch {
        // A pessoa fechou o compartilhamento: nada a fazer.
      }
      return;
    }
    await aoCopiar(url);
  };

  return (
    <>
      <ComDados r={link}>
        {({ link: url, codigo }) => (
          <div className="card col">
            <span className="mut">Seu link de indicação</span>
            <b className="quebra">{url}</b>
            <span className="mut">Código: {codigo}</span>
            <div className="btns mt">
              <Botao variante="sec" onClick={() => void aoCopiar(url)}>
                Copiar
              </Botao>
              <Botao onClick={() => void aoCompartilhar(url)}>Compartilhar</Botao>
            </div>
            {aviso && <Aviso tipo="ok">{aviso}</Aviso>}
          </div>
        )}
      </ComDados>
      <h2>Minhas indicações</h2>
      <ComDados r={r}>
        {(itens) =>
          itens.length ? (
            <>
              {itens.map((i) => (
                <div key={i.id} className="card row">
                  <div className="col">
                    <b>{i.nome}</b>
                    <span className="mut">{data(i.criado_em)}</span>
                  </div>
                  <Tag s={i.status} />
                </div>
              ))}
              <MaisItens r={r} />
            </>
          ) : (
            <Vazio texto="Quem fizer cotação pelo seu link aparece aqui." />
          )
        }
      </ComDados>
    </>
  );
}

const DESTINO: Record<NonNullable<Notificacao['destino_tipo']>, string> = {
  SINISTRO: 'sin-det',
  COTACAO: 'cot-det',
  APOLICE: 'apolice',
};

export function Notif() {
  const { go } = useNav();
  const { descontarLida } = useSessao();
  const r = usePaginado(listarNotificacoes);
  const [lidasAgora, setLidasAgora] = useState<Set<string>>(() => new Set());
  const naoLida = (n: Notificacao) => !n.lida_em && !lidasAgora.has(n.id);

  const abrir = (n: Notificacao) => {
    if (naoLida(n)) {
      setLidasAgora((s) => new Set(s).add(n.id));
      descontarLida();
      marcarNotificacaoLida(n.id).catch(() => {});
    }
    if (n.destino_tipo && n.destino_id) go(DESTINO[n.destino_tipo], n.destino_id);
  };

  return (
    <ComDados r={r}>
      {(itens) =>
        itens.length ? (
          <>
            {itens.map((n) => (
              <Card
                key={n.id}
                className={`row ${naoLida(n) ? 'nl' : ''}`}
                onClick={() => abrir(n)}
                aria-label={`${naoLida(n) ? 'Não lida: ' : ''}${n.titulo}`}
              >
                <div className="col">
                  <b>{n.titulo}</b>
                  <span>{n.mensagem}</span>
                  <span className="mut">{dataHora(n.criado_em)}</span>
                </div>
                {naoLida(n) && <span className="dot" />}
              </Card>
            ))}
            <MaisItens r={r} />
          </>
        ) : (
          <Vazio texto="Nenhuma notificação por enquanto." />
        )
      }
    </ComDados>
  );
}

export function Config() {
  const { go } = useNav();
  const { limpar } = useSessao();
  const { podeInstalar, instrucoesIos, instalar } = useInstalacao();
  const [saindo, setSaindo] = useState(false);

  const aoSair = async () => {
    setSaindo(true);
    await sair();
    limpar();
    go('login');
  };

  const itens: [tela: string, texto: string][] = [
    ['perfil', 'Meu perfil'],
    ['dados', 'Dados cadastrais e senha'],
    ['indicar', 'Indique amigos'],
    ['ajuda', 'Ajuda'],
  ];
  return (
    <>
      {itens.map(([t, l]) => (
        <Card key={t} className="row" onClick={() => go(t)}>
          <b>{l}</b>
          <Icon n="next" />
        </Card>
      ))}
      {(podeInstalar || instrucoesIos) && (
        <Card className="row" onClick={() => (podeInstalar ? void instalar() : go('instalar'))}>
          <b>Instalar o app na tela inicial</b>
          <Icon n="download" />
        </Card>
      )}
      <Botao variante="out" carregando={saindo} onClick={() => void aoSair()}>
        Sair
      </Botao>
    </>
  );
}

export function Perfil() {
  const { go } = useNav();
  const r = useApi(buscarPerfil);
  return (
    <ComDados r={r}>
      {(p) => (
        <>
          <div className="card col perfil">
            <Avatar texto={iniciais(p.nome)} grande />
            <h1>{p.nome}</h1>
            {p.cliente_desde && <span className="mut">Segurado desde {data(p.cliente_desde)}</span>}
          </div>
          <div className="card">
            <KV k="CPF" v={mascaraCpf(p.cpf)} />
            <KV k="E-mail" v={p.email} />
            <KV k="Telefone" v={telefone(p.telefone)} />
            <KV k="Data de nascimento" v={data(p.data_nascimento)} />
            <KV k="Código de indicação" v={p.codigo_indicacao} />
            <KV k="Receber campanhas" v={p.aceita_marketing ? 'Sim' : 'Não'} />
            <KV k="Termos aceitos em" v={data(p.termos_aceitos_em)} />
          </div>
          <Botao onClick={() => go('dados')}>Editar dados</Botao>
        </>
      )}
    </ComDados>
  );
}

export function Dados() {
  const r = useApi(buscarPerfil);
  return (
    <ComDados r={r}>
      {(p) => (
        <>
          <FormDados perfil={p} />
          <FormSenha />
        </>
      )}
    </ComDados>
  );
}

function FormDados({ perfil }: { perfil: PerfilApi }) {
  const envio = useEnvio();
  const [tel, setTel] = useState(mascaraTelefone(perfil.telefone ?? ''));
  const [marketing, setMarketing] = useState(perfil.aceita_marketing);
  const [salvou, setSalvou] = useState(false);

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setSalvou(false);
    const r = await envio.enviar(() =>
      atualizarPerfil({ telefone: soDigitos(tel) || null, aceita_marketing: marketing }),
    );
    if (r) setSalvou(true);
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <div className="card">
        <KV k="Nome" v={perfil.nome} />
        <KV k="CPF" v={mascaraCpf(perfil.cpf)} />
        <KV k="E-mail" v={perfil.email} />
      </div>
      <p className="mut">Para mudar nome, CPF ou e-mail, fale com a BS Seguros.</p>
      <Campo
        label="Telefone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="(00) 00000-0000"
        value={tel}
        onChange={(v) => {
          setSalvou(false);
          setTel(mascaraTelefone(v));
        }}
        erro={envio.campos.telefone}
      />
      <Caixa
        checked={marketing}
        onChange={(v) => {
          setSalvou(false);
          setMarketing(v);
        }}
        erro={envio.campos.aceita_marketing}
      >
        Receber campanhas e novidades
      </Caixa>
      {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
      {salvou && <Aviso tipo="ok">Dados salvos.</Aviso>}
      <Botao type="submit" carregando={envio.enviando}>
        Salvar alterações
      </Botao>
    </form>
  );
}

function FormSenha() {
  const envio = useEnvio();
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [trocou, setTrocou] = useState(false);

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setTrocou(false);
    const r = await envio.enviar(
      async () => {
        await trocarSenha(atual, nova);
        return true;
      },
      () => ({
        ...(atual ? {} : { senha_atual: 'Informe sua senha atual.' }),
        ...(nova.length >= 8
          ? {}
          : { nova_senha: 'A nova senha precisa de 8 caracteres ou mais.' }),
      }),
    );
    if (!r) return;
    setAtual('');
    setNova('');
    setTrocou(true);
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <h2>Trocar senha</h2>
      <Campo
        label="Senha atual"
        type="password"
        autoComplete="current-password"
        value={atual}
        onChange={setAtual}
        erro={envio.campos.senha_atual}
      />
      <Campo
        label="Nova senha (mínimo 8 caracteres)"
        type="password"
        autoComplete="new-password"
        value={nova}
        onChange={setNova}
        erro={envio.campos.nova_senha}
      />
      {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
      {trocou && <Aviso tipo="ok">Senha alterada.</Aviso>}
      <Botao type="submit" variante="out" carregando={envio.enviando}>
        Trocar senha
      </Botao>
    </form>
  );
}

const DUVIDAS: [pergunta: string, resposta: string][] = [
  [
    'Como abro um sinistro?',
    'Na aba Sinistro, toque em "Abrir sinistro", escolha a apólice e conte o que aconteceu. Você recebe um protocolo e acompanha cada mudança pelo app.',
  ],
  [
    'Onde vejo minha apólice em PDF?',
    'No Início, toque na apólice e depois em "Ver apólice em PDF".',
  ],
  [
    'Como peço uma cotação ou renovação?',
    'Na aba Cotação, toque em "Nova cotação", escolha o seguro e o tipo de pedido. A resposta chega nas notificações.',
  ],
  [
    'Esqueci minha senha. E agora?',
    'Na tela de entrada, toque em "Esqueci minha senha" e siga o link que chega no seu e-mail.',
  ],
];

export function Ajuda() {
  const contatos = useApi(() => listarContatos('SINISTRO'));
  return (
    <>
      <h2 className="m0">Dúvidas frequentes</h2>
      {DUVIDAS.map(([p, r]) => (
        <details key={p} className="card">
          <summary>{p}</summary>
          <p className="mut">{r}</p>
        </details>
      ))}
      <h2>Fale com a BS Seguros</h2>
      <ComDados r={contatos}>
        {({ itens }) =>
          itens.length ? (
            itens.map((c) => <Contato key={c.id} contato={c} />)
          ) : (
            <Vazio texto="Nenhum contato disponível no momento." />
          )
        }
      </ComDados>
    </>
  );
}

/** Passo a passo para instalar no iPhone (o Safari não tem botão de instalar). */
export function Instalar() {
  return (
    <div className="card col">
      <b>No iPhone ou iPad, pelo Safari:</b>
      <ol className="passos">
        <li>Toque no botão Compartilhar (o quadrado com a seta para cima).</li>
        <li>Role e toque em &quot;Adicionar à Tela de Início&quot;.</li>
        <li>Toque em &quot;Adicionar&quot;. O app da BS Seguros aparece junto dos outros.</li>
      </ol>
    </div>
  );
}
