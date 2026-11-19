import { useNav } from '../../app/nav'
import { Campo, Selecao } from '../../components'

export function SinNovo() {
  const { go } = useNav()
  return (
    <>
      <Selecao label="Apólice" options={['Auto — AU-2026-004821', 'Vida — VI-2023-000316']} />
      <Selecao label="Tipo de sinistro" options={['Colisão', 'Roubo', 'Incêndio', 'Dano elétrico', 'Outro']} />
      <Campo label="Data e hora da ocorrência" placeholder="DD/MM/AAAA HH:MM" />
      <Campo label="Local" placeholder="Onde aconteceu" />
      <div className="f"><label htmlFor="desc">Descrição</label><textarea id="desc" rows="4" placeholder="Conte o que aconteceu" /></div>
      <button className="btn" onClick={() => go('sin-ok')}>Abrir sinistro</button>
    </>
  )
}