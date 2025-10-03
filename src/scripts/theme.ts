const docEl = document.documentElement;
const storageKey = 'theme';
const legacyKey = 'theme-preference';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

type Theme = 'light' | 'dark';
type Mode = Theme | 'system';
type ThemeChangeHandler = (theme: Theme, mode: Mode) => void;

let currentMode: Mode = 'system';
let initialised = false;
const listeners = new Set<ThemeChangeHandler>();

const resolveTheme = (mode: Mode): Theme =>
  mode === 'system' ? (prefersDark.matches ? 'dark' : 'light') : mode;

const applyTheme = (theme: Theme) => {
  docEl.dataset.theme = theme;
};

const readStoredMode = (): Mode => {
  try {
    const stored =
      localStorage.getItem(storageKey) ?? localStorage.getItem(legacyKey);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch (error) {
    // ignore storage errors
  }
  return 'system';
};

const persistMode = (mode: Mode) => {
  try {
    if (mode === 'system') {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(legacyKey);
    } else {
      localStorage.setItem(storageKey, mode);
      localStorage.removeItem(legacyKey);
    }
  } catch (error) {
    // ignore persistence issues
  }
};

const notify = () => {
  const theme = resolveTheme(currentMode);
  listeners.forEach((listener) => listener(theme, currentMode));
};

export const setTheme = (mode: Mode) => {
  currentMode = mode;
  persistMode(mode);
  applyTheme(resolveTheme(mode));
  notify();
};

export const initTheme = (listener?: ThemeChangeHandler) => {
  if (listener) {
    listeners.add(listener);
  }

  if (!initialised) {
    currentMode = readStoredMode();
    applyTheme(resolveTheme(currentMode));

    const handleSystemChange = () => {
      if (currentMode === 'system') {
        applyTheme(resolveTheme('system'));
        notify();
      }
    };

    if (typeof prefersDark.addEventListener === 'function') {
      prefersDark.addEventListener('change', handleSystemChange);
    } else if (typeof prefersDark.addListener === 'function') {
      prefersDark.addListener(handleSystemChange);
    }

    window.setTheme = (mode: Mode) => setTheme(mode);
    initialised = true;
  }

  notify();

  return () => {
    if (listener) {
      listeners.delete(listener);
    }
  };
};

export type ThemeMode = Mode;
export type ThemeValue = Theme;

declare global {
  interface Window {
    setTheme: (mode: Mode) => void;
  }
}
