import * as React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide',
        variant === 'outline'
          ? 'border-[hsl(var(--border))] text-muted-foreground'
          : 'border-transparent bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]',
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';
