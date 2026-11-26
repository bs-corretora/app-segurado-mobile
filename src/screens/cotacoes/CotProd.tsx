import { Card, Icon } from '../../components';
import { PRODUTO, PRODUTOS } from '../../constants/rotulos';
import { useNav } from '../../app/nav';

export function CotProd() {
  const { go } = useNav();
  return (
    <>
      <p className="mut m0">Qual seguro você quer cotar?</p>
      <div className="grid-2col">
        {PRODUTOS.map((p) => (
          <Card key={p} className="row" onClick={() => go('cot-form', p)}>
            <b>{PRODUTO[p]}</b>
            <Icon n="shield" />
          </Card>
        ))}
      </div>
    </>
  );
}
