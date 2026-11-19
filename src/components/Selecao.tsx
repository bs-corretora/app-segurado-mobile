import { useId } from 'react';
import { MsgCampo } from './MsgCampo';

export function Selecao({
  label,
  value,
  onChange,
  opcoes,
  erro,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opcoes: readonly (readonly [valor: string, rotulo: string])[];
  erro?: string;
}) {
  const id = useId();
  return (
    <div className={`f ${erro ? 'inv' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-m` : undefined}
      >
        {opcoes.map(([v, r]) => (
          <option key={v} value={v}>
            {r}
          </option>
        ))}
      </select>
      <MsgCampo id={`${id}-m`} erro={erro} />
    </div>
  );
}
