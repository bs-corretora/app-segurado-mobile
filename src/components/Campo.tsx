import { useId, useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import type { ReactNode } from 'react';
import { MsgCampo } from './MsgCampo';

export type CampoProps = {
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  onBlur?: (v: string) => void;
  erro?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'datetime-local';
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  max?: string;
  maxLength?: number;
  dica?: string;
  validar?: (valor: string) => string | undefined;
  className?: string;
};

export function Campo({
  label,
  value,
  onChange,
  onBlur,
  erro,
  required,
  validar,
  dica,
  className,
  ...resto
}: CampoProps) {
  const id = useId();
  const [erroLocal, setErroLocal] = useState<string | undefined>();

  // Validação onBlur
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (validar) {
      const erroValidacao = validar(valor);
      setErroLocal(erroValidacao);
    }
    onBlur?.(valor);
  };

  // O erro exibido é o local (onBlur) ou o do envio (servidor)
  const erroExibido = erroLocal ?? erro;

  return (
    <div className={`f ${erroExibido ? 'inv' : ''} ${className ?? ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
          // Limpa erro local ao digitar
          if (erroLocal) setErroLocal(undefined);
        }}
        onBlur={handleBlur}
        aria-invalid={erroExibido ? true : undefined}
        aria-describedby={erroExibido ? `${id}-m` : undefined}
        aria-required={required}
        {...resto}
      />
      {dica && !erroExibido && <span className="dica">{dica}</span>}
      <MsgCampo id={`${id}-m`} erro={erroExibido} />
    </div>
  );
}
