import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-[hsl(var(--accent)/0.2)] blur-3xl" aria-hidden="true" />
        <div className="relative rounded-full border border-[hsl(var(--border))] bg-card/70 px-10 py-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Error 404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">This page wandered off</h1>
          <p className="mt-2 text-muted-foreground">Let's guide you back to the main experience.</p>
        </div>
      </motion.div>
      <Button asChild size="lg">
        <a href="/">Return Home</a>
      </Button>
    </div>
  );
}
