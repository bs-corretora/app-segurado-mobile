import { useState } from 'react';
import type { FormEvent } from 'react';
import { Aviso, AvisoDemora, Botao, Campo, Logo } from '../../components';
import { entrar } from '../../api';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';
import { useSessao } from '../../app/sessao';
import { validadoresPorTipo } from '../../utils/validacao';

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
    <div className="form-container">
      <form onSubmit={aoEnviar} noValidate className="form-grid">
        <p className="legend-obrigatorio" aria-hidden="true">
          * obrigatório
        </p>
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
          onBlur={setEmail}
          erro={envio.campos.email}
          required
          validar={validadoresPorTipo.email}
        />
        <Campo
          label="Senha"
          type="password"
          placeholder="Sua senha"
          autoComplete="current-password"
          value={senha}
          onChange={setSenha}
          onBlur={setSenha}
          erro={envio.campos.senha}
          required
          validar={validadoresPorTipo.senha}
        />
        {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
        <AvisoDemora ativo={envio.demorando} />
        <Botao type="submit" carregando={envio.enviando} className="full-width">
          Entrar
        </Botao>
        <button type="button" className="lk full-width" onClick={() => go('esqueci')}>
          Esqueci minha senha
        </button>
        <Botao variante="out" className="full-width" onClick={() => go('cadastro')}>
          Criar conta
        </Botao>
      </form>
    </div>
  );
}
