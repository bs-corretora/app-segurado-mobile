import { useId, useState } from 'react';
import type { CampoProps } from './Campo';
import { MsgCampo } from './MsgCampo';

export function AreaTexto({
  label,
  value,
  onChange,
  onBlur,
  erro,
  required,
  placeholder,
  maxLength,
  validar,
  className,
}: Pick<CampoProps, 'label' | 'value' | 'onChange' | 'onBlur' | 'erro' | 'required' | 'placeholder' | 'maxLength' | 'validar' | 'className'>) {
  const id = useId();
  const [erroLocal, setErroLocal] = useState<string | undefined>();

  // Validação onBlur
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
      <textarea
        id={id}
        rows={4}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => {
          onChange(e.target.value);
          // Limpa erro local ao digitar
          if (erroLocal) setErroLocal(undefined);
        }}
        onBlur={handleBlur}
        aria-invalid={erroExibido ? true : undefined}
        aria-describedby={erroExibido ? `${id}-m` : undefined}
        aria-required={required}
      />
      <MsgCampo id={`${id}-m`} erro={erroExibido} />
    </div>
  );
}
