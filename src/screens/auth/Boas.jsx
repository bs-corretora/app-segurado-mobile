import { useNav } from '../../app/nav'
import logo from '../../assets/logo.png'

const Logo = () => <div className="logo"><img src={logo} alt="BS Seguros" /></div>

export function Boas() {
  const { go } = useNav()
  return (
    <>
      <Logo />
      <h1 style={{ textAlign: 'center' }}>Tudo pronto, Thauan!</h1>
      <p className="mut" style={{ textAlign: 'center' }}>Ative as notificações para receber avisos de sinistro, cotação e renovação.</p>
      <button className="btn" onClick={() => go('home')}>Ativar notificações</button>
      <button className="lk" onClick={() => go('home')}>Agora não</button>
    </>
  )
}