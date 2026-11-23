// Nome da caixa (cache). Troque o número a cada atualização: v1, v2, v3...
const VERSAO = 'refeitorio-v1';

const ARQUIVOS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (evento) => {
    evento.waitUntil(
        caches.open(VERSAO).then((cache) => cache.addAll(ARQUIVOS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
    evento.waitUntil(
        caches.keys().then((nomes) =>
            Promise.all(
                nomes.filter((nome) => nome !== VERSAO).map((nome) => caches.delete(nome))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
    if (evento.request.method !== 'GET') return;
    if (!evento.request.url.startsWith(self.location.origin)) return;

    evento.respondWith(
        fetch(evento.request)
            .then((resposta) => {
                const copia = resposta.clone();
                caches.open(VERSAO).then((cache) => cache.put(evento.request, copia));
                return resposta;
            })
            .catch(() => caches.match(evento.request))
    );
});