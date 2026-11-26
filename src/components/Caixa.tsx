import { useId, useState } from 'react';
import type { FocusEvent, ReactNode } from 'react';
import { MsgCampo } from './MsgCampo';

export function Caixa({
  checked,
  onChange,
  onBlur,
  erro,
  required,
  validar,
  children,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  onBlur?: (v: boolean) => void;
  erro?: string;
  required?: boolean;
  validar?: (valor: boolean) => string | undefined;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const [erroLocal, setErroLocal] = useState<string | undefined>();

  // Validação onBlur
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const valor = e.target.checked;
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
      <label className="sw">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => {
            onChange(e.target.checked);
            // Limpa erro local ao mudar
            if (erroLocal) setErroLocal(undefined);
          }}
          onBlur={handleBlur}
          aria-invalid={erroExibido ? true : undefined}
          aria-describedby={erroExibido ? `${id}-m` : undefined}
          aria-required={required}
        />
        <span>{children}</span>
        {required && (
          <span className="req" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <MsgCampo id={`${id}-m`} erro={erroExibido} />
    </div>
  );
}
