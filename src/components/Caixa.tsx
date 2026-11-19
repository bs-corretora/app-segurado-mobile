import { useId } from 'react';
import type { ReactNode } from 'react';
import { MsgCampo } from './MsgCampo';

export function Caixa({
  checked,
  onChange,
  erro,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  erro?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className={`f ${erro ? 'inv' : ''}`}>
      <label className="sw">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-m` : undefined}
        />
        <span>{children}</span>
      </label>
      <MsgCampo id={`${id}-m`} erro={erro} />
    </div>
  );
}
