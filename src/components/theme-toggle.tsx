import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme, type Accent, type ThemeMode } from '../providers/theme-provider';
import { cn } from '../utils/cn';
import { useState } from 'react';

const accentOptions: { label: string; value: Accent; swatch: string }[] = [
  { label: 'Blue', value: 'blue', swatch: 'from-sky-500 to-blue-600' },
  { label: 'Emerald', value: 'emerald', swatch: 'from-emerald-400 to-emerald-600' },
  { label: 'Purple', value: 'purple', swatch: 'from-fuchsia-400 to-purple-600' }
];

const themes: { label: string; value: ThemeMode; icon: React.ReactNode }[] = [
  { label: 'Light', value: 'light', icon: <Sun className="h-4 w-4" /> },
  { label: 'Dark', value: 'dark', icon: <Moon className="h-4 w-4" /> },
  { label: 'System', value: 'system', icon: <Sun className="h-4 w-4" /> }
];

export function ThemeToggle() {
  const { accent, setAccent, theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-1">
        {themes.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition',
              theme === option.value
                ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label={`Activate ${option.label} theme`}
          >
            {option.icon}
          </button>
        ))}
      </div>
      <div className="relative">
        <Button variant="outline" size="icon" onClick={() => setOpen((prev) => !prev)} aria-expanded={open}>
          <Palette className="h-4 w-4" />
          <span className="sr-only">Choose accent color</span>
        </Button>
        {open && (
          <div className="absolute right-0 z-20 mt-3 flex w-44 flex-col gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 shadow-xl">
            {accentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setAccent(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  accent === option.value ? 'bg-[hsl(var(--accent)/0.15)]' : 'hover:bg-[hsl(var(--muted)/0.6)]'
                )}
              >
                <span
                  className={cn('h-8 w-8 rounded-full bg-gradient-to-br', option.swatch, {
                    'ring-2 ring-offset-2 ring-[hsl(var(--accent))]': accent === option.value
                  })}
                />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
