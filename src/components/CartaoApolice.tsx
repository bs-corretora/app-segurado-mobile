import type { ApoliceResumo } from '../api';
import { Card } from './Card';
import { PRODUTO } from '../constants/rotulos';
import { GLOSSARIO } from '../constants/glossario';
import { Tag } from './Selo';
import { data } from '../utils/formatos';
import { useNav } from '../app/nav';

export function CartaoApolice({ a }: { a: ApoliceResumo }) {
  const { go } = useNav();
  return (
    <Card
      onClick={() => go('apolice', a.id)}
      aria-label={`Apólice ${PRODUTO[a.produto]} ${a.numero}`}
    >
      <div className="row">
        <b>{PRODUTO[a.produto]}</b>
        <Tag s={a.status} />
      </div>
      <div className="mut">Nº {a.numero}</div>
      <div className="mut">
        <span className="tooltip" data-tooltip={GLOSSARIO.vigencia}>
          Vigência
        </span>{' '}
        {data(a.inicio_vigencia)} a {data(a.fim_vigencia)}
      </div>
    </Card>
  );
}
