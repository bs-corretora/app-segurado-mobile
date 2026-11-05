import { useNav } from '../nav'
import { Card, Contact, Field, Select, Tag } from '../ui'

export function Assist() {
  return (
    <>
      <p className="mut" style={{ margin: 0 }}>Acione a assistência 24 horas do seu seguro.</p>
      {['Auto', 'Residencial', 'Vida'].map((p) => <Contact key={p} title={`Assistência 24h — ${p}`} />)}
    </>
  )
}

export function Sinistro() {
  const { go } = useNav()
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Contato de sinistro</h2>
      <Contact title="Equipe de sinistros BS Seguros" />
      <button className="btn" onClick={() => go('sin-novo')}>Abrir sinistro</button>
      <h2>Meus sinistros</h2>
      <Card onClick={() => go('sin-det')}>
        <div className="row"><b>SIN-2026-000123</b><Tag s="EM_ANALISE" /></div>
        <div className="mut">Colisão · Auto · 20/09/2026</div>
      </Card>
    </>
  )
}

export function SinNovo() {
  const { go } = useNav()
  return (
    <>
      <Select label="Apólice" options={['Auto — AU-2026-004821', 'Vida — VI-2023-000316']} />
      <Select label="Tipo de sinistro" options={['Colisão', 'Roubo', 'Incêndio', 'Dano elétrico', 'Outro']} />
      <Field label="Data e hora da ocorrência" placeholder="DD/MM/AAAA HH:MM" />
      <Field label="Local" placeholder="Onde aconteceu" />
      <div className="f"><label htmlFor="desc">Descrição</label><textarea id="desc" rows="4" placeholder="Conte o que aconteceu" /></div>
      <button className="btn" onClick={() => go('sin-ok')}>Abrir sinistro</button>
    </>
  )
}

export function SinOk() {
  const { go } = useNav()
  return (
    <>
      <div className="card col" style={{ textAlign: 'center' }}>
        <b style={{ color: 'var(--ok)' }}>Sinistro aberto</b>
        <span className="mut">Seu protocolo</span>
        <div className="big">SIN-2026-000124</div>
        <span className="mut">Acompanhe o status e receba avisos a cada mudança.</span>
      </div>
      <button className="btn" onClick={() => go('sin-det')}>Acompanhar sinistro</button>
      <button className="btn out" onClick={() => go('sinistro')}>Voltar</button>
    </>
  )
}

export function SinDet() {
  return (
    <>
      <div className="card col">
        <div className="row"><b>SIN-2026-000123</b><Tag s="EM_ANALISE" /></div>
        <span className="mut">Colisão · Auto AU-2026-004821</span>
        <span className="mut">Av. Boa Viagem, Recife</span>
      </div>
      <h2>Histórico</h2>
      <div className="tl">
        <div><b>Em análise</b><div className="mut">22/09/2026 · Recebemos seus dados e começamos a análise.</div></div>
        <div><b>Aberto</b><div className="mut">20/09/2026 · Sinistro registrado.</div></div>
      </div>
    </>
  )
}
