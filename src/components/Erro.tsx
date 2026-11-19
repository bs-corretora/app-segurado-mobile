import { Botao } from './Botao';

export const Erro = ({ mensagem, aoTentar }: { mensagem: string; aoTentar: () => void }) => (
  <div className="estado" role="alert">
    <b>Não deu para carregar</b>
    <span className="mut">{mensagem}</span>
    <Botao variante="sec" onClick={aoTentar}>
      Tentar de novo
    </Botao>
  </div>
);
