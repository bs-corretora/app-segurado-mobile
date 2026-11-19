import { Botao } from '../../components';
import { buscarSinistro } from '../../api';
import { useApi } from '../../hooks/useApi';
import { useNav } from '../../app/nav';

export function SinOk({ arg }: { arg?: string }) {
  const { go, replace } = useNav();
  const id = arg ?? '';
  const r = useApi(() => buscarSinistro(id), [id]);
  return (
    <>
      <div className="card col tc">
        <b className="ok">Sinistro aberto</b>
        <span className="mut">Seu protocolo</span>
        <div className="big">{r.dados?.protocolo ?? '…'}</div>
        <span className="mut">
          Acompanhe o andamento por aqui. Cada mudança aparece nas notificações.
        </span>
      </div>
      <Botao onClick={() => replace('sin-det', id)}>Acompanhar sinistro</Botao>
      <Botao variante="out" onClick={() => go('sinistro')}>
        Voltar
      </Botao>
    </>
  );
}
