import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '../../utils/cn';

export const Separator = ({ className, orientation = 'horizontal', decorative = true, ...props }: SeparatorPrimitive.SeparatorProps) => (
  <SeparatorPrimitive.Root
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'bg-[hsl(var(--border)/0.6)]',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className
    )}
    {...props}
  />
);
