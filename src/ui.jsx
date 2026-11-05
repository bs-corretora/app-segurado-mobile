import { useId } from 'react'
import { useNav } from './nav'
import { ST } from './data'

const P = {
  home: <><path d="M3 11l9-8 9 8v10H3z" /><path d="M9 21v-6h6v6" /></>,
  quote: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.01" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>,
  back: <path d="M15 5l-7 7 7 7" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
}
export const Icon = ({ n }) => (
  <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
)

export const Tag = ({ s }) => <span className={`tag ${ST[s][1]}`}>{ST[s][0]}</span>

export const Card = ({ onClick, className = '', children }) => (
  <div
    className={`card ${className} ${onClick ? 'li' : ''}`}
    {...(onClick ? { role: 'button', tabIndex: 0, onClick, onKeyDown: (e) => e.key === 'Enter' && onClick() } : {})}
  >
    {children}
  </div>
)

export function Field({ label, type = 'text', placeholder, defaultValue, readOnly }) {
  const id = useId()
  return (
    <div className="f">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} placeholder={placeholder} defaultValue={defaultValue} readOnly={readOnly} />
    </div>
  )
}

export function Select({ label, options }) {
  const id = useId()
  return (
    <div className="f">
      <label htmlFor={id}>{label}</label>
      <select id={id}>{options.map((o) => <option key={o}>{o}</option>)}</select>
    </div>
  )
}

export const Contact = ({ title }) => (
  <div className="card col">
    <b>{title}</b>
    <span className="mut">(81) 0000-0000</span>
    <div className="btns" style={{ marginTop: 8 }}>
      <a className="btn sec" href="tel:+558100000000">Ligar</a>
      <a className="btn sec" href="https://wa.me/558100000000" target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </div>
  </div>
)

export function PolicyCard({ p }) {
  const { go } = useNav()
  return (
    <Card onClick={() => go('apolice', p.id)}>
      <div className="row"><b>{p.p}</b><Tag s={p.s} /></div>
      <div className="mut">Nº {p.n}</div>
      <div className="mut">Vigência {p.v}</div>
    </Card>
  )
}

export const KV = ({ k, v }) => (
  <div className="row" style={{ padding: '10px 0', borderBottom: '1px solid var(--bd)' }}>
    <span className="mut">{k}</span><b style={{ textAlign: 'right' }}>{v}</b>
  </div>
)
