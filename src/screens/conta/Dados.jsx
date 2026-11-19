import { Campo } from '../../components'

export function Dados() {
  return (
    <>
      <Campo label="Nome" defaultValue="Thauan Veiga" readOnly />
      <Campo label="CPF" defaultValue="000.000.000-00" readOnly />
      <Campo label="E-mail" type="email" defaultValue="thauan@email.com" readOnly />
      <Campo label="Telefone" type="tel" defaultValue="(81) 90000-0000" />
      <label className="sw"><input type="checkbox" defaultChecked /> Receber campanhas e novidades</label>
      <button className="btn" onClick={() => alert('Dados salvos (protótipo)')}>Salvar alterações</button>
      <h2>Trocar senha</h2>
      <Campo label="Senha atual" type="password" />
      <Campo label="Nova senha (mínimo 8 caracteres)" type="password" />
      <button className="btn out" onClick={() => alert('Senha alterada (protótipo)')}>Trocar senha</button>
    </>
  )
}