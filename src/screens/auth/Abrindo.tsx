import { useEffect, useState } from 'react';
import { Aviso, AvisoDemora, Botao, Carregando, Logo } from '../../components';
import { temSessao } from '../../api';
import { useNav } from '../../app/nav';
import { useSessao } from '../../app/sessao';

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
