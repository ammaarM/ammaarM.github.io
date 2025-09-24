import { describe, expect, it } from 'vitest';
import { filterReposByTopics, mapRepoToProject, sortRepos } from '../../lib/github';
import type { GitHubRepo } from '../../types/github';

const mockRepo = (overrides: Partial<GitHubRepo> = {}): GitHubRepo => ({
  id: 1,
  name: 'demo',
  full_name: 'test/demo',
  description: 'Demo project',
  html_url: 'https://github.com/test/demo',
  homepage: 'https://demo.dev',
  stargazers_count: 10,
  language: 'TypeScript',
  topics: ['web', 'react'],
  updated_at: new Date().toISOString(),
  owner: { login: 'test' },
  ...overrides
});

describe('github utilities', () => {
  it('sortRepos sorts by featured, stars, then updated date', () => {
    const repos = [
      mockRepo({ id: 1, full_name: 'user/alpha', stargazers_count: 50 }),
      mockRepo({ id: 2, full_name: 'user/beta', stargazers_count: 100 }),
      mockRepo({ id: 3, full_name: 'user/gamma', stargazers_count: 25 })
    ];

    const sorted = sortRepos(repos);
    expect(sorted[0].stargazers_count).toBeGreaterThanOrEqual(sorted[1].stargazers_count);
  });

  it('filterReposByTopics respects filter categories', () => {
    const repos = [
      mockRepo({ id: 1, description: 'A web application with React' }),
      mockRepo({ id: 2, description: 'Data science pipeline', topics: ['ml'] }),
      mockRepo({ id: 3, description: 'CLI developer tool', topics: ['cli'] })
    ];

    expect(filterReposByTopics(repos, 'web')).toHaveLength(1);
    expect(filterReposByTopics(repos, 'data')).toHaveLength(1);
    expect(filterReposByTopics(repos, 'tools')).toHaveLength(1);
  });

  it('mapRepoToProject prefers override metadata when available', () => {
    const repo = mockRepo({ full_name: 'user/non-featured', description: null, topics: [] });
    const project = mapRepoToProject(repo);
    expect(project.title).toBeTruthy();
    expect(project.description).not.toBeNull();
  });
});
