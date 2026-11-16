'use strict';
const CACHE_NAME='daily-move-pwa-v1';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;event.respondWith(caches.match(req).then(hit=>{if(hit)return hit;return fetch(req).then(res=>{if(res&&res.ok&&new URL(req.url).origin===self.location.origin){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));}return res;}).catch(()=>{if(req.mode==='navigate')return caches.match('./index.html');throw new Error('오프라인 상태이며 저장된 파일이 없습니다.');});}));});
