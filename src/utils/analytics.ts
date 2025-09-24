const ANALYTICS_ID = import.meta.env.VITE_ANALYTICS_ID as string | undefined;

export function initAnalytics() {
  if (!ANALYTICS_ID) return;
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.src = `https://plausible.io/js/script.js`;
  script.async = true;
  script.defer = true;
  script.setAttribute('data-domain', ANALYTICS_ID);
  document.head.appendChild(script);
}

export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (!ANALYTICS_ID) return;
  if (typeof window === 'undefined') return;

  const plausible = (window as any).plausible as ((event: string, data?: Record<string, unknown>) => void) | undefined;
  plausible?.(event, data);
}
