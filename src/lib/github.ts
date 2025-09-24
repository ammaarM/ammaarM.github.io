import featuredRaw from '@content/featured.json?raw';
import site from '@content/site.json';
import skillsRaw from '@content/skills.json?raw';
import fallbackProjects from '../data/static-projects.json';
import type { FeaturedProject, GitHubRepo } from '../types/github';
import { safeParseJSON } from './content';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || site.github.split('/').pop() || '{{YOUR_GITHUB_USERNAME}}';

const FEATURED_PROJECTS: FeaturedProject[] = safeParseJSON<FeaturedProject[]>(featuredRaw, []);
export const SKILL_GROUPS = safeParseJSON<Record<string, string[]>>(skillsRaw, {
  Languages: ['TypeScript', 'JavaScript', 'Python'],
  Frameworks: ['React', 'Next.js', 'Node.js'],
  Tooling: ['Git', 'Jest', 'Cypress']
});

const CACHE_KEY = `gh-repos-${GITHUB_USERNAME}`;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function fetchGitHubRepos(force = false): Promise<GitHubRepo[]> {
  if (typeof window !== 'undefined' && !force) {
    const cached = window.localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached) as { timestamp: number; data: GitHubRepo[] };
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      } catch (error) {
        console.warn('Failed to parse repo cache', error);
      }
    }
  }

  const endpoint = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = (await response.json()) as GitHubRepo[];

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    }

    return data;
  } catch (error) {
    console.error('Falling back to bundled projects', error);
    return fallbackProjects as GitHubRepo[];
  }
}

const FEATURED_ORDER = new Map<string, number>();
FEATURED_PROJECTS.forEach((project, index) => {
  if (project.repo) {
    FEATURED_ORDER.set(project.repo.toLowerCase(), index);
  }
});

export function sortRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return [...repos].sort((a, b) => {
    const aKey = a.full_name.toLowerCase();
    const bKey = b.full_name.toLowerCase();
    const aFeatured = FEATURED_ORDER.has(aKey) ? FEATURED_ORDER.get(aKey)! : Number.POSITIVE_INFINITY;
    const bFeatured = FEATURED_ORDER.has(bKey) ? FEATURED_ORDER.get(bKey)! : Number.POSITIVE_INFINITY;

    if (aFeatured !== bFeatured) {
      return aFeatured - bFeatured;
    }

    if (a.stargazers_count !== b.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }

    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

export function mapRepoToProject(repo: GitHubRepo): FeaturedProject {
  const override = FEATURED_PROJECTS.find((project) => project.repo?.toLowerCase() === repo.full_name.toLowerCase());
  return (
    override || {
      title: repo.name,
      description: repo.description ?? 'No description provided.',
      tags: repo.topics && repo.topics.length > 0 ? repo.topics : repo.language ? [repo.language] : [],
      repo: repo.full_name,
      homepage: repo.homepage || undefined
    }
  );
}

export function filterReposByTopics(repos: GitHubRepo[], filter: 'all' | 'web' | 'data' | 'tools') {
  if (filter === 'all') return repos;
  const keywords: Record<'web' | 'data' | 'tools', string[]> = {
    web: ['web', 'react', 'next', 'frontend', 'ui'],
    data: ['data', 'sql', 'ml', 'model', 'analysis', 'ai'],
    tools: ['cli', 'tool', 'library', 'plugin']
  };
  return repos.filter((repo) => {
    const topicString = `${repo.topics?.join(' ') ?? ''} ${repo.description ?? ''}`.toLowerCase();
    return keywords[filter].some((keyword) => topicString.includes(keyword));
  });
}

export function getLanguageColor(language: string | null): string {
  if (!language) return '#94a3b8';
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#facc15',
    Python: '#3776ab',
    Java: '#f97316',
    Go: '#00add8',
    Rust: '#b45309'
  };
  return colors[language] ?? '#38bdf8';
}

export async function fetchCaseStudy(repoFullName: string): Promise<string | null> {
  const branchCandidates = ['main', 'master'];

  for (const branch of branchCandidates) {
    const url = `https://raw.githubusercontent.com/${repoFullName}/${branch}/case-study.md`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.warn('Case study fetch failed', error);
    }
  }

  return null;
}

export { FEATURED_PROJECTS };
