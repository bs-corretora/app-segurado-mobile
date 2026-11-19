import { Botao, Logo } from '../../components';
import { primeiroNome } from '../../utils/formatos';
import { useInstalacao } from '../../pwa/instalacao';
import { useNav } from '../../app/nav';
import { useSessao } from '../../app/sessao';

/** Boas-vindas logo depois do cadastro. */
export function Boas() {
  const { go } = useNav();
  const { resumo } = useSessao();
  const { podeInstalar, instalar } = useInstalacao();
  const qtd = resumo?.apolices_ativas.length ?? 0;
  return (
    <div className="centro">
      <Logo />
      <h1 className="tc">Tudo pronto{resumo ? `, ${primeiroNome(resumo.nome)}` : ''}!</h1>
      <p className="mut tc">
        {qtd > 0
          ? `Encontramos ${qtd} ${qtd === 1 ? 'apólice ativa' : 'apólices ativas'} no seu CPF.`
          : 'Quando você contratar um seguro com a BS Seguros, ele aparece aqui.'}{' '}
        Os avisos de sinistro, cotação e renovação chegam no sininho do app.
      </p>
      {podeInstalar && (
        <Botao variante="sec" onClick={() => void instalar()}>
          Instalar o app na tela inicial
        </Botao>
      )}
      <Botao onClick={() => go('home')}>Começar</Botao>
    </div>
  );
}
