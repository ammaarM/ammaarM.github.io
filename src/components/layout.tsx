import { PropsWithChildren } from 'react';
import { ThemeToggle } from './theme-toggle';
import site from '@content/site.json';
import { Button } from './ui/button';
import { Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const navigation = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.85)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="text-muted-foreground transition hocus:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <a href={site.github} aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="icon">
            <a href={site.linkedin} aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const lastUpdated = new Date().toLocaleDateString();
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background)/0.9)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {site.name}. Crafted with care. Last updated {lastUpdated}.
        </p>
        <div className="flex items-center gap-3 text-sm">
          <a href="/sitemap.xml" className="hocus:text-foreground text-muted-foreground">
            Sitemap
          </a>
          <span aria-hidden="true">·</span>
          <a href="/robots.txt" className="hocus:text-foreground text-muted-foreground">
            Robots
          </a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${site.email}`} className="hocus:text-foreground text-muted-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
