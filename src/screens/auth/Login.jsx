import { useNav } from '../../app/nav'
import { Campo } from '../../components'
import logo from '../../assets/logo.png'

const Logo = () => <div className="logo"><img src={logo} alt="BS Seguros" /></div>

export function Login() {
  const { go } = useNav()
  return (
    <>
      <Logo />
      <h1 style={{ textAlign: 'center' }}>Bem-vindo de volta</h1>
      <Campo label="E-mail" type="email" placeholder="voce@email.com" />
      <Campo label="Senha" type="password" placeholder="Sua senha" />
      <button className="btn" onClick={() => go('home')}>Entrar</button>
      <button className="lk" onClick={() => go('esqueci')}>Esqueci minha senha</button>
      <button className="btn out" onClick={() => go('cadastro')}>Criar conta</button>
    </>
  )
}