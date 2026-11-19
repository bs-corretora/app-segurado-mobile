import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';

export function Card({
  onClick,
  className = '',
  children,
  ...resto
}: { onClick?: () => void; className?: string; children: ReactNode } & Omit<
  HTMLAttributes<HTMLDivElement>,
  'onClick'
>) {
  return (
    <div
      className={`card ${className} ${onClick ? 'li' : ''}`}
      {...(onClick
        ? {
            role: 'button',
            tabIndex: 0,
            onClick,
            onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            },
          }
        : {})}
      {...resto}
    >
      {children}
    </div>
  );
}
