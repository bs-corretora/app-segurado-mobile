import { ComDados, Contato, Vazio } from '../../components';
import { listarContatos } from '../../api';
import type { Contato as ContatoApi } from '../../api';
import { useApi } from '../../hooks/useApi';
import { useSessao } from '../../app/sessao';

/** Contatos de assistência 24h; os dos produtos que a pessoa tem aparecem primeiro. */
export function Assist() {
  const { resumo } = useSessao();
  const r = useApi(() => listarContatos('ASSISTENCIA_24H'));
  const meus = new Set(resumo?.apolices_ativas.map((a) => a.produto));
  const ordem = (c: ContatoApi) => (c.produto && meus.has(c.produto) ? 0 : 1);
  return (
    <>
      <p className="mut m0">Acione a assistência 24 horas do seu seguro.</p>
      <ComDados r={r}>
        {({ itens }) =>
          itens.length ? (
            [...itens]
              .sort((a, b) => ordem(a) - ordem(b))
              .map((c) => <Contato key={c.id} contato={c} />)
          ) : (
            <Vazio texto="Nenhum contato de assistência disponível no momento." />
          )
        }
      </ComDados>
    </>
  );
}
