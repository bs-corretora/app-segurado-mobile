// Registra o service worker (só no build de produção) e avisa quando há versão nova do app.
// A versão nova só assume quando a pessoa toca em "Atualizar": assim ninguém perde um formulário
// pela metade por causa de um deploy.
import { useSyncExternalStore } from 'react';

let novaVersao: ServiceWorker | null = null;
let pediuAtualizacao = false;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());

export function registrarServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (pediuAtualizacao) window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        const guardar = (sw: ServiceWorker | null) => {
          // Sem controlador = primeira instalação: não há versão antiga para trocar.
          if (sw && navigator.serviceWorker.controller) {
            novaVersao = sw;
            avisar();
          }
        };
        guardar(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          sw?.addEventListener('statechange', () => {
            if (sw.state === 'installed') guardar(sw);
          });
        });
        // Quem deixa o app aberto por dias também recebe a versão nova.
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') reg.update().catch(() => {});
        });
      })
      .catch(() => {
        // Sem service worker o app funciona igual, só não abre offline.
      });
  });
}

export function atualizarApp(): void {
  if (!novaVersao) return;
  pediuAtualizacao = true;
  novaVersao.postMessage('SKIP_WAITING');
}

export function useNovaVersao(): boolean {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => novaVersao !== null,
    () => false,
  );
}
