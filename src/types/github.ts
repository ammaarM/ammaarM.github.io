export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  owner: {
    login: string;
  };
}

export interface FeaturedProject {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  repo?: string;
  homepage?: string;
}

export type ProjectFilter = 'all' | 'web' | 'data' | 'tools';
