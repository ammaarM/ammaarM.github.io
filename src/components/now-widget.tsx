import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { memo, useMemo } from 'react';
import site from '@content/site.json';

interface GitHubEvent {
  type: string;
  created_at: string;
}

async function fetchRecentActivity(username: string) {
  const response = await fetch(`https://api.github.com/users/${username}/events/public`);
  if (!response.ok) {
    throw new Error('Unable to fetch activity');
  }
  return (await response.json()) as GitHubEvent[];
}

export const NowWidget = memo(function NowWidget() {
  const username = import.meta.env.VITE_GITHUB_USERNAME || site.github.split('/').pop() || '{{YOUR_GITHUB_USERNAME}}';
  const { data, isLoading, isError } = useQuery({
    queryKey: ['activity', username],
    queryFn: () => fetchRecentActivity(username),
    staleTime: 1000 * 60 * 10,
    retry: 1
  });

  const counts = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date.toISOString().slice(0, 10);
    });

    const map = new Map(days.map((day) => [day, 0] as const));
    (data ?? []).forEach((event) => {
      const day = event.created_at.slice(0, 10);
      if (map.has(day)) {
        map.set(day, (map.get(day) ?? 0) + 1);
      }
    });

    return days.map((day) => map.get(day) ?? 0);
  }, [data]);

  const max = Math.max(...counts, 1);

  return (
    <div className="rounded-3xl border border-[hsl(var(--border))] bg-card/70 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Now</h3>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Tracking the past week of public GitHub activity.
      </p>
      {isError && <p className="mt-4 text-sm text-red-400">Unable to load activity right now.</p>}
      {!isError && (
        <svg viewBox={`0 0 ${counts.length * 20} 60`} className="mt-6 h-24 w-full">
          <polyline
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="3"
            strokeLinecap="round"
            points={counts
              .map((value, index) => {
                const x = index * 20 + 10;
                const y = 50 - (value / max) * 40;
                return `${x},${y}`;
              })
              .join(' ')}
          />
          {counts.map((value, index) => {
            const x = index * 20 + 10;
            const y = 50 - (value / max) * 40;
            return <circle key={index} cx={x} cy={y} r={3} fill="hsl(var(--accent))" />;
          })}
        </svg>
      )}
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        {counts.map((value, index) => (
          <span key={index} className="flex-1 text-center">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
});
