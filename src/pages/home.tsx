import heroContent from '@content/hero.md?raw';
import aboutContent from '@content/about.md?raw';
import site from '@content/site.json';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';
import { marked } from 'marked';
import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { useInView } from 'react-intersection-observer';

import { fetchGitHubRepos, filterReposByTopics, sortRepos, SKILL_GROUPS } from '../lib/github';
import type { GitHubRepo, ProjectFilter } from '../types/github';
import { Avatar } from '../components/avatar';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { ProjectCard } from '../components/project-card';
import { CommandPalette } from '../components/command-palette';
import { NowWidget } from '../components/now-widget';
import { usePrefersReducedMotion } from '../hooks/use-prefers-reduced-motion';
import { stripFrontMatter } from '../lib/content';

const heroHTML = marked.parse(stripFrontMatter(heroContent || ''));
const aboutHTML = marked.parse(stripFrontMatter(aboutContent || ''));

export function HomePage() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { data: repos = [], isLoading } = useQuery<GitHubRepo[]>({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos(),
    staleTime: 1000 * 60 * 30
  });
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [search, setSearch] = useState('');

  const filteredRepos = useMemo(() => {
    const filtered = filterReposByTopics(repos, filter);
    const sorted = sortRepos(filtered);
    if (!search) return sorted;
    return sorted.filter((repo) => repo.name.toLowerCase().includes(search.toLowerCase()));
  }, [repos, filter, search]);

  const { ref: projectsRef, inView: projectsInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="relative space-y-24 pb-24">
      <CommandPalette />
      <section id="hero" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[1.25fr_0.75fr] md:items-center">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">{site.tagline}</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance md:text-6xl">{site.name}</h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="prose prose-invert max-w-none text-lg text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: heroHTML }}
            />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  size="lg"
                  className="group flex items-center gap-2"
                  onMouseMove={(event) => magneticHover(event, prefersReducedMotion)}
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Github className="h-5 w-5" /> View Projects
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={`mailto:${site.email}`}>
                    <Mail className="mr-2 h-5 w-5" /> Contact
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-4">
            <Avatar />
            <p className="text-sm text-muted-foreground">Based in {site.location}</p>
          </motion.div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">About</h2>
              <div className="prose prose-invert mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: aboutHTML }} />
              <Button asChild className="mt-8">
                <a href={site.resumeUrl} download>
                  Download CV
                </a>
              </Button>
            </div>
            <div className="rounded-3xl border border-[hsl(var(--border))] bg-card/70 p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="mt-4 grid gap-6">
                {Object.entries(SKILL_GROUPS).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{category}</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="projects" ref={projectsRef} className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={projectsInView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.6 }}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Projects</h2>
              <p className="mt-2 text-muted-foreground">
                Automatically sourced from GitHub. Hover for stack details, filter by type, and search instantly.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:w-80">
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" aria-label="Search projects" />
              <Tabs value={filter} onValueChange={(value) => setFilter(value as ProjectFilter)}>
                <TabsList className="w-full justify-between">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="web">Web</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading && <ProjectSkeletons />}
            {!isLoading && filteredRepos.map((repo) => <ProjectCard key={repo.id} repo={repo} />)}
            {!isLoading && filteredRepos.length === 0 && (
              <p className="col-span-full rounded-3xl border border-dashed border-[hsl(var(--border))] p-10 text-center text-muted-foreground">
                No projects found. Try another filter or keyword.
              </p>
            )}
          </div>
        </motion.div>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid gap-12 md:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Experience</h2>
            <Timeline />
          </div>
          <NowWidget />
        </motion.div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-3xl border border-[hsl(var(--border))] bg-card/70 p-8 shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight">Let's build something</h2>
          <p className="mt-2 text-muted-foreground">Ready for new collaborations or opportunities. Drop a note, and I'll respond quickly.</p>
          <form className="mt-6 grid gap-4 md:grid-cols-2" action={`https://formspree.io/f/{{YOUR_FORM_ID}}`} method="POST">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <Input id="name" name="name" autoComplete="name" required className="mt-2" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" required className="mt-2" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                Message
              </label>
              <textarea id="message" name="message" required rows={4} className="mt-2 min-h-[140px] w-full rounded-2xl border border-[hsl(var(--border))] bg-transparent px-5 py-4 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit">Send</Button>
              <Button asChild variant="outline">
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  Connect on LinkedIn
                </a>
              </Button>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}

function magneticHover(event: MouseEvent<HTMLElement>, disabled: boolean) {
  if (disabled) return;
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const strength = 10;
  const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
  const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
  button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  button.addEventListener(
    'mouseleave',
    () => {
      button.style.transform = 'translate(0, 0)';
    },
    { once: true }
  );
}

function ProjectSkeletons() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-72 animate-pulse rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.2)]" />
      ))}
    </>
  );
}

const timeline = [
  {
    title: 'Senior Front-end Engineer',
    organization: '{{YOUR_NAME}} Studio',
    period: '2022 — Present',
    description: 'Leading design systems and performance initiatives for global SaaS products.'
  },
  {
    title: 'Front-end Engineer',
    organization: 'Innovative Labs',
    period: '2019 — 2022',
    description: 'Shipped accessible web applications for millions of users across multiple industries.'
  },
  {
    title: 'B.S. in Computer Science',
    organization: '{{YOUR_UNIVERSITY}}',
    period: '2015 — 2019',
    description: 'Focused on human-computer interaction and scalable web architectures.'
  }
];

function Timeline() {
  return (
    <ol className="mt-8 space-y-6">
      {timeline.map((item) => (
        <li key={item.title} className="relative rounded-3xl border border-[hsl(var(--border))] bg-card/70 p-6 shadow-sm">
          <span className="text-sm uppercase tracking-wide text-muted-foreground">{item.period}</span>
          <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.organization}</p>
          <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
