import { useNav } from '../../app/nav'
import { Card } from '../../components'

export function Config() {
  const { go } = useNav()
  return (
    <>
      {[['perfil', 'Meu perfil'], ['dados', 'Dados cadastrais'], ['indicar', 'Indique amigos'], ['ajuda', 'Ajuda']].map(([t, l]) => (
        <Card key={t} className="row" onClick={() => go(t)}><b>{l}</b><span className="mut">›</span></Card>
      ))}
      <button className="btn out" onClick={() => go('login')}>Sair</button>
    </>
  )
}