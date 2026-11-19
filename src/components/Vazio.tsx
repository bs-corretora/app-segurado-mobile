import type { ReactNode } from 'react';

export const Vazio = ({ texto, children }: { texto: string; children?: ReactNode }) => (
  <div className="estado vazio">
    <span className="mut">{texto}</span>
    {children}
  </div>
);
