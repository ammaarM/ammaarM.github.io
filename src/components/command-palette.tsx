import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Github, Mail, Notebook } from 'lucide-react';
import site from '@content/site.json';
import { useNavigate } from 'react-router-dom';
import { matchSorter } from 'match-sorter';

interface CommandItem {
  id: string;
  label: string;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const items = useMemo<CommandItem[]>(
    () => [
      { id: 'hero', label: 'Go to hero', action: () => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'about', label: 'Go to about', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'projects', label: 'Go to projects', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'experience', label: 'Go to experience', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'contact', label: 'Go to contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'resume', label: 'Open resume', action: () => navigate('/resume') },
      { id: 'github', label: 'Open GitHub', action: () => window.open(site.github, '_blank') ?? undefined },
      { id: 'email', label: 'Send email', action: () => (window.location.href = `mailto:${site.email}`) }
    ],
    [navigate]
  );

  const filtered = useMemo(() => {
    if (!query) return items;
    return matchSorter(items, query, { keys: ['label'] });
  }, [query, items]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0">
        <div className="flex flex-col gap-2 p-4">
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands..."
            aria-label="Search commands"
          />
          <ul className="max-h-72 overflow-y-auto">
            {filtered.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-between rounded-xl px-4 py-3 text-left text-sm"
                  onClick={() => {
                    item.action();
                    setOpen(false);
                  }}
                >
                  {item.label}
                  {item.id === 'github' && <Github className="h-4 w-4" />}
                  {item.id === 'resume' && <Notebook className="h-4 w-4" />}
                  {item.id === 'email' && <Mail className="h-4 w-4" />}
                </Button>
              </li>
            ))}
            {filtered.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted-foreground">No commands found.</p>}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
