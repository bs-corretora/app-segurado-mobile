export const Card = ({ onClick, className = '', children }) => (
  <div
    className={`card ${className} ${onClick ? 'li' : ''}`}
    {...(onClick ? { role: 'button', tabIndex: 0, onClick, onKeyDown: (e) => e.key === 'Enter' && onClick() } : {})}
  >
    {children}
  </div>
)