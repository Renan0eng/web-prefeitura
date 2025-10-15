'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    console.log('[SW] Registrando Service Worker...');
    if ('serviceWorker' in navigator) {
      console.log('[SW] Navegador suporta Service Worker.');
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => console.log('[SW] Service Worker registrado:', reg.scope))
        .catch(err => console.error('[SW] Erro ao registrar Service Worker:', err));
    }
  }, []);

  return null;
}
