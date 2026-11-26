import { useRef, FormEvent } from 'react';

export type CampoFormulario = {
  nome: string;
  validar: (valor: string | boolean) => string | undefined;
  valor: string | boolean;
  ref?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
};

export type UseFormularioRetorno = {
  registrar: (campo: CampoFormulario) => void;
  validarTodos: () => Record<string, string>;
  limparErros: () => void;
};

/**
 * Hook para gerenciar validação de formulário com suporte a onBlur e onSubmit.
 * - Registra campos com suas funções de validação
 * - Valida todos os campos no submit
 * - Foca/scrolla para o primeiro campo com erro
 */
export function useFormulario() {
  const camposRef = useRef<Map<string, CampoFormulario>>(new Map());
  const errosRef = useRef<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const registrar = (campo: CampoFormulario) => {
    camposRef.current.set(campo.nome, campo);
  };

  const validarTodos = (): Record<string, string> => {
    const erros: Record<string, string> = {};
    camposRef.current.forEach((campo, nome) => {
      const erro = campo.validar(campo.valor);
      if (erro) {
        erros[nome] = erro;
      }
    });
    errosRef.current = erros;
    return erros;
  };

  const limparErros = () => {
    errosRef.current = {};
  };

  const focarPrimeiroErro = () => {
    const primeiroErro = Object.keys(errosRef.current)[0];
    if (primeiroErro) {
      const campo = camposRef.current.get(primeiroErro);
      if (campo?.ref?.current) {
        campo.ref.current.focus();
        campo.ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (formRef.current) {
        // Fallback: tenta encontrar pelo name
        const input = formRef.current.querySelector(`[name="${primeiroErro}"]`) as HTMLElement;
        input?.focus();
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>, aoEnviar: () => Promise<void>) => {
    e.preventDefault();
    const erros = validarTodos();
    if (Object.keys(erros).length > 0) {
      focarPrimeiroErro();
      return;
    }
    aoEnviar();
  };

  return {
    formRef,
    registrar,
    validarTodos,
    limparErros,
    handleSubmit,
  };
}

/**
 * Componente wrapper que adiciona a legenda "* obrigatório" e integra com useFormulario.
 */
interface FormularioProps {
  children: React.ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  className?: string;
}

export function Formulario({ children, onSubmit, className = '' }: FormularioProps) {
  const { formRef, handleSubmit } = useFormulario();

  return (
    <form
      ref={formRef}
      onSubmit={(e) => handleSubmit(e, () => onSubmit(e))}
      noValidate
      className={className}
    >
      <p className="legenda-obrigatorio" aria-hidden="true">
        * obrigatório
      </p>
      {children}
    </form>
  );
}
