import { useId } from 'react';
import type { CampoProps } from './Campo';
import { MsgCampo } from './MsgCampo';

export function AreaTexto({
  label,
  value,
  onChange,
  erro,
  placeholder,
  maxLength,
}: Pick<CampoProps, 'label' | 'value' | 'onChange' | 'erro' | 'placeholder' | 'maxLength'>) {
  const id = useId();
  return (
    <div className={`f ${erro ? 'inv' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={4}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-m` : undefined}
      />
      <MsgCampo id={`${id}-m`} erro={erro} />
    </div>
  );
}
