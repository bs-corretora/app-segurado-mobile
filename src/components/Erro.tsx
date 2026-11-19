import { Botao } from './Botao';

export const Erro = ({
  mensagem,
  aoTentar,
  titulo = 'Não deu para carregar',
}: {
  mensagem: string;
  aoTentar: () => void;
  titulo?: string;
}) => (
  <div className="estado" role="alert">
    <b>{titulo}</b>
    <span className="mut">{mensagem}</span>
    <Botao variante="sec" onClick={aoTentar}>
      Tentar de novo
    </Botao>
  </div>
);
