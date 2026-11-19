import { useNav } from '../../app/nav'
import { Campo } from '../../components'

export function Cadastro() {
  const { go } = useNav()
  return (
    <>
      <h1>Criar conta</h1>
      <Campo label="Nome completo" placeholder="Seu nome" />
      <Campo label="CPF" placeholder="000.000.000-00" />
      <Campo label="E-mail" type="email" placeholder="voce@email.com" />
      <Campo label="Telefone" type="tel" placeholder="(00) 00000-0000" />
      <Campo label="Data de nascimento" placeholder="DD/MM/AAAA" />
      <Campo label="Senha (mínimo 8 caracteres)" type="password" placeholder="Crie uma senha" />
      <h2>Já tem apólice? (opcional)</h2>
      <Campo label="Número da apólice" placeholder="Ex.: AU-2026-004821" />
      <label className="sw"><input type="checkbox" /> Li e aceito os termos de uso e a política de privacidade</label>
      <button className="btn" onClick={() => go('boas')}>Criar conta</button>
      <button className="lk" onClick={() => go('login')}>Já tenho conta</button>
    </>
  )
}