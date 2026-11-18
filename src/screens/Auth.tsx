import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { cadastrar, entrar, pedirNovaSenha, temSessao } from '../api';
import { useNav } from '../nav';
import { useSessao } from '../sessao';
import { useEnvio } from '../hooks/useEnvio';
import { useInstalacao } from '../pwa/instalacao';
import {
  mascaraCpf,
  mascaraTelefone,
  paraInputDataHora,
  primeiroNome,
  soDigitos,
} from '../formatos';
import { Aviso, Botao, Caixa, Campo, Carregando } from '../ui';
import logo from '../assets/logo.png';

const Logo = () => (
  <div className="logo">
    <img src={logo} alt="BS Seguros" />
  </div>
);

const AvisoDemora = ({ ativo }: { ativo: boolean }) =>
  ativo ? (
    <Aviso tipo="info">
      O servidor está acordando. O primeiro acesso pode levar até um minuto.
    </Aviso>
  ) : null;

/** Primeira tela: com token guardado, confere se a sessão ainda vale. */
export function Abrindo() {
  const { go } = useNav();
  const { atualizar, erro } = useSessao();
  const [tentativa, setTentativa] = useState(0);
  const [falhou, setFalhou] = useState(false);
  const [demorando, setDemorando] = useState(false);

  useEffect(() => {
    if (!temSessao()) {
      go('login');
      return;
    }
    let ativo = true;
    setFalhou(false);
    const timer = setTimeout(() => setDemorando(true), 5000);
    void atualizar().then((ok) => {
      clearTimeout(timer);
      if (!ativo) return;
      if (ok) go('home');
      // Token recusado: o cliente da API já limpou a sessão e levou ao login.
      else if (temSessao()) setFalhou(true);
    });
    return () => {
      ativo = false;
      clearTimeout(timer);
    };
  }, [tentativa, go, atualizar]);

  return (
    <div className="centro">
      <Logo />
      {falhou ? (
        <>
          <Aviso tipo="err">{erro ?? 'Não foi possível conectar.'}</Aviso>
          <Botao onClick={() => setTentativa((n) => n + 1)}>Tentar de novo</Botao>
        </>
      ) : (
        <>
          <Carregando texto="Abrindo…" />
          <AvisoDemora ativo={demorando} />
        </>
      )}
    </div>
  );
}

export function Login() {
  const { go } = useNav();
  const { atualizar } = useSessao();
  const envio = useEnvio();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    const r = await envio.enviar(
      () => entrar(email.trim(), senha),
      () => ({
        ...(email.trim() ? {} : { email: 'Informe seu e-mail.' }),
        ...(senha ? {} : { senha: 'Informe sua senha.' }),
      }),
    );
    if (!r) return;
    await atualizar();
    go('home');
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <Logo />
      <h1 className="tc">Bem-vindo de volta</h1>
      <Campo
        label="E-mail"
        type="email"
        placeholder="voce@email.com"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={setEmail}
        erro={envio.campos.email}
      />
      <Campo
        label="Senha"
        type="password"
        placeholder="Sua senha"
        autoComplete="current-password"
        value={senha}
        onChange={setSenha}
        erro={envio.campos.senha}
      />
      {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
      <AvisoDemora ativo={envio.demorando} />
      <Botao type="submit" carregando={envio.enviando}>
        Entrar
      </Botao>
      <button type="button" className="lk" onClick={() => go('esqueci')}>
        Esqueci minha senha
      </button>
      <Botao variante="out" onClick={() => go('cadastro')}>
        Criar conta
      </Botao>
    </form>
  );
}

export function Esqueci() {
  const { go } = useNav();
  const envio = useEnvio();
  const [email, setEmail] = useState('');

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    const r = await envio.enviar(
      async () => {
        await pedirNovaSenha(email.trim());
        return true;
      },
      () => (email.trim() ? {} : { email: 'Informe seu e-mail.' }),
    );
    if (r) go('esqueciok');
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <h1>Redefinir senha</h1>
      <p className="mut">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
      <Campo
        label="E-mail"
        type="email"
        placeholder="voce@email.com"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={setEmail}
        erro={envio.campos.email}
      />
      {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
      <AvisoDemora ativo={envio.demorando} />
      <Botao type="submit" carregando={envio.enviando}>
        Enviar link
      </Botao>
      <button type="button" className="lk" onClick={() => go('login')}>
        Voltar ao login
      </button>
    </form>
  );
}

export function EsqueciOk() {
  const { go } = useNav();
  return (
    <>
      <div className="card col">
        <b>Verifique seu e-mail</b>
        <span className="mut">
          Se o e-mail estiver cadastrado, você receberá o link em instantes. Depois de criar a nova
          senha, volte aqui para entrar.
        </span>
      </div>
      <Botao onClick={() => go('login')}>Voltar ao login</Botao>
    </>
  );
}

export function Cadastro() {
  const { go } = useNav();
  const { atualizar } = useSessao();
  const envio = useEnvio();
  const [f, setF] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    senha: '',
    numero_apolice: '',
    aceite_termos: false,
  });
  const muda =
    <K extends keyof typeof f>(k: K) =>
    (v: (typeof f)[K]) =>
      setF((atual) => ({ ...atual, [k]: v }));
  const hoje = paraInputDataHora(new Date()).slice(0, 10);
  const c = envio.campos;

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    const r = await envio.enviar(
      () =>
        cadastrar({
          nome: f.nome.trim(),
          cpf: soDigitos(f.cpf),
          email: f.email.trim(),
          telefone: soDigitos(f.telefone),
          data_nascimento: f.data_nascimento,
          senha: f.senha,
          numero_apolice: f.numero_apolice.trim() || undefined,
          aceite_termos: true,
        }),
      () =>
        f.aceite_termos ? {} : { aceite_termos: 'É preciso aceitar os termos para criar a conta.' },
    );
    if (!r) return;
    await atualizar();
    go('home');
    go('boas');
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <h1>Criar conta</h1>
      <Campo
        label="Nome completo"
        placeholder="Seu nome"
        autoComplete="name"
        value={f.nome}
        onChange={muda('nome')}
        erro={c.nome}
      />
      <Campo
        label="CPF"
        placeholder="000.000.000-00"
        inputMode="numeric"
        value={f.cpf}
        onChange={(v) => muda('cpf')(mascaraCpf(v))}
        erro={c.cpf}
      />
      <Campo
        label="E-mail"
        type="email"
        placeholder="voce@email.com"
        autoComplete="email"
        inputMode="email"
        value={f.email}
        onChange={muda('email')}
        erro={c.email}
      />
      <Campo
        label="Celular"
        type="tel"
        placeholder="(00) 00000-0000"
        autoComplete="tel-national"
        inputMode="tel"
        value={f.telefone}
        onChange={(v) => muda('telefone')(mascaraTelefone(v))}
        erro={c.telefone}
      />
      <Campo
        label="Data de nascimento"
        type="date"
        autoComplete="bday"
        max={hoje}
        value={f.data_nascimento}
        onChange={muda('data_nascimento')}
        erro={c.data_nascimento}
      />
      <Campo
        label="Senha (mínimo 8 caracteres)"
        type="password"
        placeholder="Crie uma senha"
        autoComplete="new-password"
        value={f.senha}
        onChange={muda('senha')}
        erro={c.senha}
      />
      <h2>Já tem apólice? (opcional)</h2>
      <Campo
        label="Número da apólice"
        placeholder="Ex.: AU-2026-004821"
        value={f.numero_apolice}
        onChange={(v) => muda('numero_apolice')(v.toUpperCase())}
        erro={c.numero_apolice}
        dica="Com ele, as apólices do seu CPF já aparecem no app."
      />
      <Caixa checked={f.aceite_termos} onChange={muda('aceite_termos')} erro={c.aceite_termos}>
        Li e aceito os termos de uso e a política de privacidade
      </Caixa>
      {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
      <AvisoDemora ativo={envio.demorando} />
      <Botao type="submit" carregando={envio.enviando}>
        Criar conta
      </Botao>
      <button type="button" className="lk" onClick={() => go('login')}>
        Já tenho conta
      </button>
    </form>
  );
}

/** Boas-vindas logo depois do cadastro. */
export function Boas() {
  const { go } = useNav();
  const { resumo } = useSessao();
  const { podeInstalar, instalar } = useInstalacao();
  const qtd = resumo?.apolices_ativas.length ?? 0;
  return (
    <div className="centro">
      <Logo />
      <h1 className="tc">Tudo pronto{resumo ? `, ${primeiroNome(resumo.nome)}` : ''}!</h1>
      <p className="mut tc">
        {qtd > 0
          ? `Encontramos ${qtd} ${qtd === 1 ? 'apólice ativa' : 'apólices ativas'} no seu CPF.`
          : 'Quando você contratar um seguro com a BS Seguros, ele aparece aqui.'}{' '}
        Os avisos de sinistro, cotação e renovação chegam no sininho do app.
      </p>
      {podeInstalar && (
        <Botao variante="sec" onClick={() => void instalar()}>
          Instalar o app na tela inicial
        </Botao>
      )}
      <Botao onClick={() => go('home')}>Começar</Botao>
    </div>
  );
}
