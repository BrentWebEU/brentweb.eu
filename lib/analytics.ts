export function getClientId() {
  try {
    const key = 'ga_client_id';
    let id = null;
    if (typeof localStorage !== 'undefined') {
      id = localStorage.getItem(key);
    }
    if (!id) {
      if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
        id = (crypto as any).randomUUID();
      } else {
        id = `cid_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      }
      try {
        localStorage.setItem('ga_client_id', id);
      } catch (e) {
        // ignore
      }
    }
    return id;
  } catch (e) {
    return `cid_${Date.now()}`;
  }
}

export function sendEvent(name: string, params: Record<string, any> = {}) {
  try {
    const payload = {
      event: name,
      ...params,
      client_id: getClientId(),
    };

    // send to local server tracking
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/track', blob);
      } catch (e) {}
    } else if (typeof fetch !== 'undefined') {
      try {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}
    }

    // client-side gtag if available
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', name, params);
      }
    } catch (e) {}
  } catch (e) {
    // swallow errors - analytics must never break UX
  }
}
