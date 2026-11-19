import { useState } from 'react';
import type { FormEvent } from 'react';
import { Aviso, AvisoDemora, Botao, Campo } from '../../components';
import { pedirNovaSenha } from '../../api';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';

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
