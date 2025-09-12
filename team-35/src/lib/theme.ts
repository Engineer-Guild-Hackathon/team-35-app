export type Theme = 'light' | 'dark' | 'system';

export function resolveSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const finalTheme = theme === 'system' ? resolveSystemTheme() : theme;
  if (finalTheme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export function applyThemeFromStorage() {
  try {
    const saved = (localStorage.getItem('theme') as Theme | null) ?? 'system';
    applyTheme(saved);
  } catch {
    applyTheme('system');
  }
}

export function setTheme(theme: Theme) {
  try { localStorage.setItem('theme', theme); } catch {}
  applyTheme(theme);
}

