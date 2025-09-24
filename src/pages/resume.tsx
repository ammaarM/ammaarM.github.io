import site from '@content/site.json';
import { SKILL_GROUPS } from '../lib/github';

export function ResumePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 print:px-0">
      <header className="border-b border-[hsl(var(--border))] pb-6">
        <h1 className="text-4xl font-bold">{site.name}</h1>
        <p className="mt-2 text-muted-foreground">{site.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span aria-hidden="true">•</span>
          <a href={site.github}>{site.github}</a>
          <span aria-hidden="true">•</span>
          <a href={site.linkedin}>{site.linkedin}</a>
          <span aria-hidden="true">•</span>
          <span>{site.location}</span>
        </div>
      </header>
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold uppercase tracking-wide">Summary</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          {{YOUR_BIO}}
        </p>
      </section>
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold uppercase tracking-wide">Experience</h2>
        <div className="space-y-6 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground">Senior Front-end Engineer — {{YOUR_NAME}} Studio</h3>
            <p className="text-xs">2022 — Present</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Design and ship modular design systems with WCAG-compliant components.</li>
              <li>Lead performance initiatives delivering 95+ Lighthouse scores on mission-critical apps.</li>
              <li>Mentor engineers, drive code reviews, and advocate for inclusive UX patterns.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Front-end Engineer — Innovative Labs</h3>
            <p className="text-xs">2019 — 2022</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Implemented data-rich dashboards with React, D3, and real-time APIs.</li>
              <li>Partnered with designers and PMs to deliver accessible experiences in record time.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold uppercase tracking-wide">Education</h2>
        <p className="text-sm text-muted-foreground">
          B.S. in Computer Science — {{YOUR_UNIVERSITY}} (2015 — 2019)
        </p>
      </section>
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold uppercase tracking-wide">Skills</h2>
        <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          {Object.entries(SKILL_GROUPS).map(([category, skills]) => (
            <div key={category}>
              <h3 className="font-medium text-foreground">{category}</h3>
              <p>{skills.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
      <p className="mt-12 text-xs text-muted-foreground print:hidden">Print this page for a one-page resume snapshot.</p>
    </div>
  );
}
