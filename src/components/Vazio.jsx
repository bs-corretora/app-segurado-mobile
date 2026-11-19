export const Vazio = ({ mensagem = 'Nenhum item encontrado' }) => (
  <div className="card vaz" role="status">
    <span className="mut">{mensagem}</span>
  </div>
)