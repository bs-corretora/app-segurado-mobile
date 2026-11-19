import { useNav } from '../../app/nav'
import { Campo } from '../../components'

export function Esqueci() {
  const { go } = useNav()
  return (
    <>
      <h1>Redefinir senha</h1>
      <p className="mut">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
      <Campo label="E-mail" type="email" placeholder="voce@email.com" />
      <button className="btn" onClick={() => go('esqueciok')}>Enviar link</button>
      <button className="lk" onClick={() => go('login')}>Voltar ao login</button>
    </>
  )
}