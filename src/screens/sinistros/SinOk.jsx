import { useNav } from '../../app/nav'

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