export const KV = ({ k, v }) => (
  <div className="row" style={{ padding: '10px 0', borderBottom: '1px solid var(--bd)' }}>
    <span className="mut">{k}</span><b style={{ textAlign: 'right' }}>{v}</b>
  </div>
)