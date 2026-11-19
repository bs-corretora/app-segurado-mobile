export const Carregando = ({ texto = 'Carregando…' }: { texto?: string }) => (
  <div className="estado" role="status">
    <span className="spin grande" aria-hidden="true" />
    <span className="mut">{texto}</span>
  </div>
);
