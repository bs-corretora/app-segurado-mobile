import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Aviso, AvisoDemora, Botao, Campo, Logo } from '../../components';
import { confirmarEmail, reenviarCodigo } from '../../api';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';
import { useSessao } from '../../app/sessao';
import {
  ESPERA_REENVIO_S,
  codigoCompleto,
  guardarPendente,
  lerPendente,
  limparCodigo,
  limparPendente,
  salvar,
  segundosRestantes,
} from '../../utils/codigoEmail';

/** Depois do cadastro, ou do login de conta sem e-mail confirmado: digitar o código de 6 dígitos. */
export function ConfirmarEmail({ arg }: { arg?: string }) {
  const { go } = useNav();
  const { atualizar } = useSessao();
  const envio = useEnvio();
  const reenvio = useEnvio();
  const [codigo, setCodigo] = useState('');
  const [reenviado, setReenviado] = useState(false);
  // O e-mail vem da navegação; depois de um refresh, do que ficou guardado na aba.
  const [pendente] = useState(() => {
    const salvo = lerPendente();
    if (arg && salvo?.email === arg) return salvo;
    return arg ? guardarPendente(arg, false) : salvo;
  });
  const email = pendente?.email ?? '';
  const [liberaEm, setLiberaEm] = useState(pendente?.liberaEm ?? 0);
  const [restam, setRestam] = useState(() => segundosRestantes(liberaEm));

  useEffect(() => {
    if (!email) go('login');
  }, [email, go]);

  useEffect(() => {
    setRestam(segundosRestantes(liberaEm));
    const t = setInterval(() => {
      const s = segundosRestantes(liberaEm);
      setRestam(s);
      if (s === 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [liberaEm]);

  const aoConfirmar = async (e: FormEvent) => {
    e.preventDefault();
    const r = await envio.enviar(
      () => confirmarEmail(email, codigo),
      () => (codigoCompleto(codigo) ? {} : { codigo: 'Digite os 6 números do código.' }),
    );
    if (!r || !pendente) return;
    limparPendente();
    await atualizar();
    go('home');
    if (pendente.novo) go('boas');
  };

  const aoReenviar = async () => {
    setReenviado(false);
    const r = await reenvio.enviar(async () => {
      await reenviarCodigo(email);
      return true;
    });
    if (!r) return;
    const proximo = Date.now() + ESPERA_REENVIO_S * 1000;
    setLiberaEm(proximo);
    salvar({ email, novo: pendente?.novo ?? false, liberaEm: proximo });
    setCodigo('');
    setReenviado(true);
  };

  return (
    <form onSubmit={aoConfirmar} noValidate>
      <Logo />
      <h1 className="tc">Confirme seu e-mail</h1>
      <p className="tc corpo">
        Enviamos um código de 6 números para <b className="quebra">{email}</b>. Digite-o abaixo para
        entrar.
      </p>
      <div className="codigo">
        <Campo
          label="Código de 6 números"
          placeholder="000000"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={codigo}
          onChange={(v) => setCodigo(limparCodigo(v))}
          erro={envio.campos.codigo}
          dica="Confira também a caixa de spam."
        />
      </div>
      {envio.erro && !envio.campos.codigo && <Aviso tipo="err">{envio.erro}</Aviso>}
      <AvisoDemora ativo={envio.demorando} />
      <Botao type="submit" carregando={envio.enviando}>
        Confirmar
      </Botao>
      {reenviado && !reenvio.erro && <Aviso tipo="ok">Enviamos um novo código.</Aviso>}
      {reenvio.erro && <Aviso tipo="err">{reenvio.erro}</Aviso>}
      <button
        type="button"
        className="lk"
        onClick={() => void aoReenviar()}
        disabled={restam > 0 || reenvio.enviando}
      >
        {restam > 0 ? `Reenviar código em ${restam} s` : 'Reenviar código'}
      </button>
      <button
        type="button"
        className="lk"
        onClick={() => {
          limparPendente();
          go('login');
        }}
      >
        Voltar ao login
      </button>
    </form>
  );
}
