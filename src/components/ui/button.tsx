import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-lg shadow-[hsl(var(--accent)/0.25)] hover:shadow-[hsl(var(--accent)/0.35)] hover:-translate-y-0.5',
        outline:
          'border border-[hsl(var(--border))] bg-transparent text-foreground hover:border-[hsl(var(--accent)/0.5)] hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.05)]',
        ghost: 'bg-transparent text-foreground hover:bg-[hsl(var(--accent)/0.08)]',
        subtle: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/0.9)]'
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
