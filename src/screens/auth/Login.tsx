import { useState } from 'react';
import type { FormEvent } from 'react';
import { Aviso, AvisoDemora, Botao, Campo, Logo } from '../../components';
import { entrar } from '../../api';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';
import { useSessao } from '../../app/sessao';

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
