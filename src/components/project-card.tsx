import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useMemo } from 'react';
import { usePrefersReducedMotion } from '../hooks/use-prefers-reduced-motion';
import { Link } from 'react-router-dom';
import type { GitHubRepo } from '../types/github';
import { getLanguageColor, mapRepoToProject } from '../lib/github';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ProjectCardProps {
  repo: GitHubRepo;
}

export function ProjectCard({ repo }: ProjectCardProps) {
  const project = useMemo(() => mapRepoToProject(repo), [repo]);
  const reduceMotion = usePrefersReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(circle at 20% 20%, hsl(var(--accent) / 0.25), transparent 60%)`;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    rotateX.set(((y - centerY) / centerY) * -6);
    rotateY.set(((x - centerX) / centerX) * 6);
  };

  const handleMouseLeave = () => {
    if (reduceMotion) return;
    rotateX.set(0);
    rotateY.set(0);
  };

  const topics = project.tags.length > 0 ? project.tags : repo.language ? [repo.language] : [];

  return (
    <motion.article
      className="group relative flex h-full flex-col rounded-3xl border border-[hsl(var(--border))] bg-card/60 p-6 shadow-lg transition"
      style={{ rotateX, rotateY, background }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={reduceMotion ? undefined : { translateY: -8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <span
              aria-hidden="true"
              className="inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language ?? 'Unknown'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.slice(0, 6).map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> Repo
            </a>
          </Button>
          {repo.homepage && (
            <Button asChild size="sm">
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live
              </a>
            </Button>
          )}
          <Button asChild size="sm" variant="ghost">
            <Link to={`/projects/${repo.owner.login}/${repo.name}/case-study`}>Case Study</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Updated {new Date(repo.updated_at).toLocaleDateString()}</p>
      </div>
    </motion.article>
  );
}
