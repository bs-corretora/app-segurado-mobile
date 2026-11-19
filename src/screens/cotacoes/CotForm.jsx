import { useNav } from '../../app/nav'
import { COB } from '../../constants/data'
import { Campo, Selecao } from '../../components'

export function CotForm({ arg }) {
  const { go } = useNav()
  return (
    <>
      <div className="card"><span className="mut">Produto</span><br /><b>{arg}</b></div>
      <Selecao label="Tipo de pedido" options={['Novo seguro', 'Renovação']} />
      <Selecao label="Tipo de cobertura" options={COB[arg]} />
      <Campo label="Telefone para contato" type="tel" placeholder="(00) 00000-0000" />
      <div className="f"><label htmlFor="det">Detalhes do pedido</label><textarea id="det" rows="4" placeholder="Informe o que você precisa" /></div>
      <button className="btn" onClick={() => go('cotacao')}>Enviar pedido</button>
    </>
  )
}