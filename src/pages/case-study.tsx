import { useQuery } from '@tanstack/react-query';
import { marked } from 'marked';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCaseStudy } from '../lib/github';
import { stripFrontMatter } from '../lib/content';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function CaseStudyPage() {
  const { owner = '{{YOUR_GITHUB_USERNAME}}', repo = '' } = useParams();
  const repoFullName = `${owner}/${repo}`;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['case-study', repoFullName],
    queryFn: () => fetchCaseStudy(repoFullName),
    staleTime: 1000 * 60 * 60
  });

  const html = useMemo(() => marked.parse(stripFrontMatter(data ?? '')), [data]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-24">
      <Button asChild variant="ghost" className="gap-2">
        <a href="/">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </a>
      </Button>
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Case Study</p>
        <h1 className="text-4xl font-semibold tracking-tight">{repoFullName}</h1>
      </header>
      {isLoading && <p className="text-muted-foreground">Loading project story…</p>}
      {isError && <p className="text-red-400">Could not load case study. Check the repository for a case-study.md file.</p>}
      {!isLoading && !isError && !data && (
        <p className="text-muted-foreground">No case study available yet. Check back soon!</p>
      )}
      {data && (
        <article className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  );
}
