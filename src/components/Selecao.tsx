import { useId, useState } from 'react';
import type { FocusEvent } from 'react';
import type { ReactNode } from 'react';
import { MsgCampo } from './MsgCampo';

export function Selecao({
  label,
  value,
  onChange,
  onBlur,
  opcoes,
  erro,
  required,
  validar,
  className,
}: {
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  onBlur?: (v: string) => void;
  opcoes: readonly (readonly [valor: string, rotulo: string])[];
  erro?: string;
  required?: boolean;
  validar?: (valor: string) => string | undefined;
  className?: string;
}) {
  const id = useId();
  const [erroLocal, setErroLocal] = useState<string | undefined>();

  // Validação onBlur
  const handleBlur = (e: FocusEvent<HTMLSelectElement>) => {
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
        {required && (
          <span className="req" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          // Limpa erro local ao selecionar
          if (erroLocal) setErroLocal(undefined);
        }}
        onBlur={handleBlur}
        aria-invalid={erroExibido ? true : undefined}
        aria-describedby={erroExibido ? `${id}-m` : undefined}
        aria-required={required}
      >
        {opcoes.map(([v, r]) => (
          <option key={v} value={v}>
            {r}
          </option>
        ))}
      </select>
      <MsgCampo id={`${id}-m`} erro={erroExibido} />
    </div>
  );
}
