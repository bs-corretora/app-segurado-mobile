import type { ReactNode } from 'react';

export function Aviso({ tipo, children }: { tipo: 'err' | 'ok' | 'info'; children: ReactNode }) {
  return (
    <div className={`aviso ${tipo}`} role={tipo === 'err' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
