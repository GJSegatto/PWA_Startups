var versao=1;

const CACHE_NAME = 'cache-v5';
// List the files to precache
const PRECACHE_ASSETS = ['/', 'index.html','/js/utils.js']

self.addEventListener('install',async function(event) {
    console.log('Roda o install')
        /* O evento de install é ativado somente uma vez, quando você registra a versão do sw.js pela primeira vez. Se o sw.js muda uma única coisa, o install é chamado novamente. Use esse evento para preparar tudo que seja necessário */
        
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(PRECACHE_ASSETS);
    });

self.addEventListener("activate", function(event) {
    /*O evento activate é ativado somente uma vez também, quando uma nova versão do sw.js foi instalado e não tem nenhuma versão anterior rodando em outra aba. Então você basicamente utiliza esse evento para deletar coisas antigas de versões anteriores. */
    console.log('Service worker activate event!');

});

async function networkFirst(request) {
try {
const networkResponse = await fetch(request);
if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
}
return networkResponse;
} catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || Response.error();
    }
}

/*
self.addEventListener("fetch", (event) => {
const url = new URL(event.request.url);

if (url.pathname.match("css/meuEstilo.css")) {
event.respondWith(networkFirst('css/meuEstilo2.css'));
}
else {
    if (url.pathname.match(/^\/inbox/)) {
        event.respondWith(networkFirst(event.request));
    }
}
});
*/