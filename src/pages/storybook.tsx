import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ThemeToggle } from '../components/theme-toggle';
import { ProjectCard } from '../components/project-card';
import type { GitHubRepo } from '../types/github';

const demoRepo: GitHubRepo = {
  id: 999,
  name: 'storybook-demo',
  full_name: 'demo/storybook-demo',
  description: 'Sample project card preview with hover tilt and actions.',
  html_url: 'https://github.com/demo/storybook-demo',
  homepage: 'https://demo.dev',
  stargazers_count: 42,
  language: 'TypeScript',
  topics: ['react', 'storybook'],
  updated_at: new Date().toISOString(),
  owner: { login: 'demo' }
};

export function StorybookPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">UI Preview</h1>
        <p className="text-muted-foreground">Quick glance at reusable primitives.</p>
      </header>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary CTA</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="subtle">Subtle</Button>
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Card</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Subtle supporting description text.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cards use soft backgrounds and borders, matching the overall glassmorphic aesthetic.
            </p>
          </CardContent>
        </Card>
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex gap-3">
          <Badge>default</Badge>
          <Badge variant="outline">outline</Badge>
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Theme</h2>
        <ThemeToggle />
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Project card</h2>
        <div className="max-w-lg">
          <ProjectCard repo={demoRepo} />
        </div>
      </section>
    </div>
  );
}
