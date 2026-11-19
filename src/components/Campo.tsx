import { useId } from 'react';
import type { ChangeEvent } from 'react';
import { MsgCampo } from './MsgCampo';

export type CampoProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  erro?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'datetime-local';
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  max?: string;
  maxLength?: number;
  dica?: string;
};

export function Campo({ label, value, onChange, erro, dica, ...resto }: CampoProps) {
  const id = useId();
  return (
    <div className={`f ${erro ? 'inv' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-m` : undefined}
        {...resto}
      />
      {dica && !erro && <span className="dica">{dica}</span>}
      <MsgCampo id={`${id}-m`} erro={erro} />
    </div>
  );
}
