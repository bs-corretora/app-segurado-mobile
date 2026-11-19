// Estado de um formulário que manda dado para a API: enviando, erro por campo (400) e erro geral.
import { useCallback, useRef, useState } from 'react';
import { ErroApi } from '../api';
import { mensagemDeCampo, mensagemDeErro } from '../utils/formatos';

/** Depois deste tempo enviando, a tela avisa que o servidor pode estar acordando. */
const AVISO_DEMORA_MS = 6000;

export function useEnvio() {
  const [enviando, setEnviando] = useState(false);
  const [demorando, setDemorando] = useState(false);
  const [campos, setCampos] = useState<Record<string, string>>({});
  const [erro, setErro] = useState<string | null>(null);
  const emAndamento = useRef(false);

  /**
   * Roda a chamada. Em erro, preenche `campos`/`erro` e devolve `undefined`.
   * `validar` pode barrar o envio antes (devolva os erros por campo, ou `{}` para seguir).
   */
  const enviar = useCallback(
    async <T>(acao: () => Promise<T>, validar?: () => Partial<Record<string, string>>) => {
      if (emAndamento.current) return undefined;
      const locais = Object.fromEntries(
        Object.entries(validar?.() ?? {}).filter((par): par is [string, string] => !!par[1]),
      );
      if (Object.keys(locais).length) {
        setCampos(locais);
        setErro('Confira os campos destacados.');
        return undefined;
      }
      emAndamento.current = true;
      setEnviando(true);
      setCampos({});
      setErro(null);
      const timer = setTimeout(() => setDemorando(true), AVISO_DEMORA_MS);
      try {
        return await acao();
      } catch (e) {
        if (e instanceof ErroApi)
          setCampos(
            Object.fromEntries(
              Object.entries(e.campos).map(([k, m]) => [k, mensagemDeCampo(k, m)]),
            ),
          );
        setErro(mensagemDeErro(e));
        return undefined;
      } finally {
        clearTimeout(timer);
        emAndamento.current = false;
        setEnviando(false);
        setDemorando(false);
      }
    },
    [],
  );

  return { enviando, demorando, campos, erro, enviar };
}
