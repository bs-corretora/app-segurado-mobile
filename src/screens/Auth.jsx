import { Image, View } from 'react-native'
import { useNav } from '../nav'
import { useS } from '../theme'
import { B, Btn, Check, Field, Link, T } from '../ui'

const Logo = () => {
  const s = useS()
  return <View style={s.logo}><Image source={require('../../assets/logo.png')} style={s.logoImg} resizeMode="contain" accessibilityLabel="BS Seguros" /></View>
}

export function Login() {
  const s = useS()
  const { go } = useNav()
  return (
    <>
      <Logo />
      <B style={[s.h1, s.center]}>Bem-vindo de volta</B>
      <Field label="E-mail" type="email" placeholder="voce@email.com" />
      <Field label="Senha" type="password" placeholder="Sua senha" />
      <Btn testID="entrar" onPress={() => go('home')}>Entrar</Btn>
      <Link onPress={() => go('esqueci')}>Esqueci minha senha</Link>
      <Btn kind="out" onPress={() => go('cadastro')}>Criar conta</Btn>
    </>
  )
}

export function Esqueci() {
  const s = useS()
  const { go } = useNav()
  return (
    <>
      <B style={s.h1}>Redefinir senha</B>
      <T style={s.mut}>Informe seu e-mail e enviaremos um link para criar uma nova senha.</T>
      <Field label="E-mail" type="email" placeholder="voce@email.com" />
      <Btn onPress={() => go('esqueciok')}>Enviar link</Btn>
      <Link onPress={() => go('login')}>Voltar ao login</Link>
    </>
  )
}

export function EsqueciOk() {
  const s = useS()
  const { go } = useNav()
  return (
    <>
      <View style={[s.card, s.col]}><B>Verifique seu e-mail</B><T style={s.mut}>Se o e-mail estiver cadastrado, você receberá o link em instantes.</T></View>
      <Btn onPress={() => go('login')}>Voltar ao login</Btn>
    </>
  )
}

export function Cadastro() {
  const s = useS()
  const { go } = useNav()
  return (
    <>
      <B style={s.h1}>Criar conta</B>
      <Field label="Nome completo" placeholder="Seu nome" />
      <Field label="CPF" placeholder="000.000.000-00" />
      <Field label="E-mail" type="email" placeholder="voce@email.com" />
      <Field label="Telefone" type="tel" placeholder="(00) 00000-0000" />
      <Field label="Data de nascimento" placeholder="DD/MM/AAAA" />
      <Field label="Senha (mínimo 8 caracteres)" type="password" placeholder="Crie uma senha" />
      <T style={s.h2}>Já tem apólice? (opcional)</T>
      <Field label="Número da apólice" placeholder="Ex.: AU-2026-004821" />
      <Check label="Li e aceito os termos de uso e a política de privacidade" />
      <Btn onPress={() => go('boas')}>Criar conta</Btn>
      <Link onPress={() => go('login')}>Já tenho conta</Link>
    </>
  )
}

export function Boas() {
  const s = useS()
  const { go } = useNav()
  return (
    <>
      <Logo />
      <B style={[s.h1, s.center]}>Tudo pronto, Thauan!</B>
      <T style={[s.mut, s.center]}>Ative as notificações para receber avisos de sinistro, cotação e renovação.</T>
      <Btn onPress={() => go('home')}>Ativar notificações</Btn>
      <Link onPress={() => go('home')}>Agora não</Link>
    </>
  )
}
