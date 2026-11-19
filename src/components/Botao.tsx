import type { ReactNode } from 'react';

export function Botao({
  children,
  variante = 'pri',
  carregando = false,
  type = 'button',
  onClick,
  disabled,
}: {
  children: ReactNode;
  variante?: 'pri' | 'sec' | 'out';
  carregando?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      className={`btn ${variante === 'pri' ? '' : variante}`}
      onClick={onClick}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
    >
      {carregando ? <span className="spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
