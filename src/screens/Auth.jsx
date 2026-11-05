import { useNav } from '../nav'
import { Field } from '../ui'
import logo from '../assets/logo.png'

const Logo = () => <div className="logo"><img src={logo} alt="BS Seguros" /></div>

export function Login() {
  const { go } = useNav()
  return (
    <>
      <Logo />
      <h1 style={{ textAlign: 'center' }}>Bem-vindo de volta</h1>
      <Field label="E-mail" type="email" placeholder="voce@email.com" />
      <Field label="Senha" type="password" placeholder="Sua senha" />
      <button className="btn" onClick={() => go('home')}>Entrar</button>
      <button className="lk" onClick={() => go('esqueci')}>Esqueci minha senha</button>
      <button className="btn out" onClick={() => go('cadastro')}>Criar conta</button>
    </>
  )
}

export function Esqueci() {
  const { go } = useNav()
  return (
    <>
      <h1>Redefinir senha</h1>
      <p className="mut">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
      <Field label="E-mail" type="email" placeholder="voce@email.com" />
      <button className="btn" onClick={() => go('esqueciok')}>Enviar link</button>
      <button className="lk" onClick={() => go('login')}>Voltar ao login</button>
    </>
  )
}

export function EsqueciOk() {
  const { go } = useNav()
  return (
    <>
      <div className="card col"><b>Verifique seu e-mail</b><span className="mut">Se o e-mail estiver cadastrado, você receberá o link em instantes.</span></div>
      <button className="btn" onClick={() => go('login')}>Voltar ao login</button>
    </>
  )
}

export function Cadastro() {
  const { go } = useNav()
  return (
    <>
      <h1>Criar conta</h1>
      <Field label="Nome completo" placeholder="Seu nome" />
      <Field label="CPF" placeholder="000.000.000-00" />
      <Field label="E-mail" type="email" placeholder="voce@email.com" />
      <Field label="Telefone" type="tel" placeholder="(00) 00000-0000" />
      <Field label="Data de nascimento" placeholder="DD/MM/AAAA" />
      <Field label="Senha (mínimo 8 caracteres)" type="password" placeholder="Crie uma senha" />
      <h2>Já tem apólice? (opcional)</h2>
      <Field label="Número da apólice" placeholder="Ex.: AU-2026-004821" />
      <label className="sw"><input type="checkbox" /> Li e aceito os termos de uso e a política de privacidade</label>
      <button className="btn" onClick={() => go('boas')}>Criar conta</button>
      <button className="lk" onClick={() => go('login')}>Já tenho conta</button>
    </>
  )
}

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
