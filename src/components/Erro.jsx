export const Erro = ({ mensagem = 'Ocorreu um erro' }) => (
  <div className="card err" role="alert">
    <b>Erro</b>
    <span className="mut">{mensagem}</span>
  </div>
)