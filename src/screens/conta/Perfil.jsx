import { useNav } from '../../app/nav'
import { Card, KV } from '../../components'

export function Perfil() {
  const { go } = useNav()
  const dados = [
    ['Nome completo', 'Thauan Veiga'], ['CPF', '000.000.000-00'], ['E-mail', 'thauan@email.com'],
    ['Telefone', '(81) 90000-0000'], ['Data de nascimento', '03/11/1998'], ['Cliente desde', '05/06/2023'],
    ['Código de indicação', 'TV8K2Q'], ['Receber campanhas', 'Sim'], ['Termos aceitos em', '05/06/2023'],
  ]
  return (
    <>
      <div className="card col" style={{ alignItems: 'center', textAlign: 'center' }}>
        <div className="av" style={{ width: 64, height: 64, fontSize: 22, color: '#fff' }}>TV</div>
        <h1>Thauan Veiga</h1>
        <span className="mut">Segurado desde 05/06/2023</span>
      </div>
      <div className="card">{dados.map(([k, v]) => <KV key={k} k={k} v={v} />)}</div>
      <button className="btn" onClick={() => go('dados')}>Editar dados</button>
    </>
  )
}