import { useNav } from '../nav'
import { NOT } from '../data'
import { Card, Contact, Field, KV, Tag } from '../ui'

export function Indicar() {
  return (
    <>
      <div className="card col">
        <span className="mut">Seu link de indicação</span>
        <b>bsseguros.com/i/TV8K2Q</b>
        <div className="btns" style={{ marginTop: 8 }}>
          <button className="btn sec" onClick={() => alert('Link copiado (protótipo)')}>Copiar</button>
          <button className="btn" onClick={() => alert('Compartilhar (protótipo)')}>Compartilhar</button>
        </div>
      </div>
      <h2>Minhas indicações</h2>
      {[['Carla Mendes', 'CONVERTIDA'], ['Rafael Lima', 'CONTATADA'], ['Bruna Alves', 'NOVA']].map(([n, s]) => (
        <div key={n} className="card row"><b>{n}</b><Tag s={s} /></div>
      ))}
    </>
  )
}

export function Notif() {
  const { go } = useNav()
  return NOT.map((n) => (
    <Card key={n.t} className="row" onClick={() => go(...n.d)}>
      <div className="col"><b>{n.t}</b><span className="mut">{n.m}</span></div>
      {n.u ? <span className="dot" /> : null}
    </Card>
  ))
}

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

export function Dados() {
  return (
    <>
      <Field label="Nome" defaultValue="Thauan Veiga" readOnly />
      <Field label="CPF" defaultValue="000.000.000-00" readOnly />
      <Field label="E-mail" type="email" defaultValue="thauan@email.com" readOnly />
      <Field label="Telefone" type="tel" defaultValue="(81) 90000-0000" />
      <label className="sw"><input type="checkbox" defaultChecked /> Receber campanhas e novidades</label>
      <button className="btn" onClick={() => alert('Dados salvos (protótipo)')}>Salvar alterações</button>
      <h2>Trocar senha</h2>
      <Field label="Senha atual" type="password" />
      <Field label="Nova senha (mínimo 8 caracteres)" type="password" />
      <button className="btn out" onClick={() => alert('Senha alterada (protótipo)')}>Trocar senha</button>
    </>
  )
}

export function Ajuda() {
  return (
    <>
      <p className="mut" style={{ margin: 0 }}>Fale com a BS Seguros.</p>
      <Contact title="Atendimento BS Seguros" />
    </>
  )
}
