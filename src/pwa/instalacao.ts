// Instalar o app na tela inicial. No Android/Chrome o navegador avisa que dá para instalar
// (`beforeinstallprompt`) e o app guarda esse aviso para o botão "Instalar". No iPhone não existe
// esse aviso: a tela explica o caminho pelo botão Compartilhar do Safari.
import { useSyncExternalStore } from 'react';

type PedidoInstalacao = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let pedido: PedidoInstalacao | null = null;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());

/** Chamar uma vez, cedo (main.tsx): o aviso pode chegar antes de qualquer tela montar. */
export function ouvirInstalacao(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    pedido = e as PedidoInstalacao;
    avisar();
  });
  window.addEventListener('appinstalled', () => {
    pedido = null;
    avisar();
  });
}

function assinar(f: () => void) {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
}

/** Já está aberto como app instalado (sem a barra do navegador)? */
export function rodandoInstalado(): boolean {
  if (typeof window === 'undefined') return false;
  const ios = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return ios || (window.matchMedia?.('(display-mode: standalone)').matches ?? false);
}

/** iPhone/iPad (inclui o iPad que se apresenta como Mac). */
export function ehIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  );
}

export function useInstalacao() {
  const atual = useSyncExternalStore(
    assinar,
    () => pedido,
    () => null,
  );
  const instalado = rodandoInstalado();
  return {
    /** O navegador oferece a instalação direta (Android/Chrome/Edge). */
    podeInstalar: !!atual && !instalado,
    /** iPhone pelo Safari: instalação manual pelo botão Compartilhar. */
    instrucoesIos: !atual && !instalado && ehIos(),
    instalar: async () => {
      if (!pedido) return false;
      await pedido.prompt();
      const { outcome } = await pedido.userChoice;
      // O mesmo aviso não pode ser usado duas vezes.
      pedido = null;
      avisar();
      return outcome === 'accepted';
    },
  };
}
