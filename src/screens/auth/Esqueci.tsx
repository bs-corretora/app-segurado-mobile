import { useState } from 'react';
import type { FormEvent } from 'react';
import { Aviso, AvisoDemora, Botao, Campo } from '../../components';
import { pedirNovaSenha } from '../../api';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';
import { validadoresPorTipo } from '../../utils/validacao';

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
    <div className="form-container">
      <form onSubmit={aoEnviar} noValidate className="form-grid">
        <p className="legend-obrigatorio" aria-hidden="true">* obrigatório</p>
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
          onBlur={setEmail}
          erro={envio.campos.email}
          required
          validar={validadoresPorTipo.email}
        />
        {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
        <AvisoDemora ativo={envio.demorando} />
        <Botao type="submit" carregando={envio.enviando} className="full-width">
          Enviar link
        </Botao>
        <button type="button" className="lk full-width" onClick={() => go('login')}>
          Voltar ao login
        </button>
      </form>
    </div>
  );
}
