import type { Contato as ContatoApi } from '../api';
import { soDigitos, telefone } from '../utils/formatos';

export function Contato({ contato }: { contato: ContatoApi }) {
  const tel = contato.telefone ? soDigitos(contato.telefone) : null;
  const zap = contato.whatsapp ? soDigitos(contato.whatsapp) : null;
  return (
    <div className="card col">
      <b>{contato.rotulo}</b>
      {tel && <span className="mut">{telefone(tel)}</span>}
      <div className="btns mt">
        {tel && (
          <a className="btn sec" href={`tel:${tel}`}>
            Ligar
          </a>
        )}
        {zap && (
          <a
            className="btn sec"
            href={`https://wa.me/${zap}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
