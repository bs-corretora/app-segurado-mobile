// Service worker do App do Segurado.
// Este arquivo é um modelo: no build, pwa/plugin.js preenche VERSAO e ARQUIVOS e publica o
// resultado em /sw.js.
//
// - Guarda o app (HTML, JS, CSS, ícones) para abrir rápido e mesmo sem internet.
// - NUNCA guarda nada da API nem os PDFs: dados do segurado só vêm da rede.
// - Versão nova fica esperando até o app pedir (botão "Atualizar"), para não trocar o app no
//   meio de um formulário.

const VERSAO = self.__VERSAO__;
const ARQUIVOS = self.__ARQUIVOS__;
const PREFIXO = 'bs-segurado-';
const CACHE = PREFIXO + VERSAO;

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    (async () => {
      for (const nome of await caches.keys()) {
        if (nome.startsWith(PREFIXO) && nome !== CACHE) await caches.delete(nome);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (evento) => {
  if (evento.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (evento) => {
  const pedido = evento.request;
  if (pedido.method !== 'GET') return;
  const url = new URL(pedido.url);
  // Outra origem (API, PDF, WhatsApp...): o navegador resolve direto, sem passar pelo cache.
  if (url.origin !== self.location.origin) return;

  // Qualquer página do app abre o index.html guardado (o app tem uma página só).
  if (pedido.mode === 'navigate') {
    evento.respondWith(
      caches
        .open(CACHE)
        .then((cache) => cache.match('/'))
        .then((guardado) => guardado || fetch(pedido)),
    );
    return;
  }

  evento.respondWith(
    caches
      .open(CACHE)
      .then((cache) => cache.match(pedido))
      .then((guardado) => guardado || fetch(pedido)),
  );
});
