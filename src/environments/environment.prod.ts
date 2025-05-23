declare global {
  interface Window {
    __env?: { apiUrl?: string };
  }
}

export const environment = {
  production: true,
  apiUrl: window.__env?.apiUrl ?? 'https://fallback-tu-api/',
};
