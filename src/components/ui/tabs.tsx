import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn';

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex h-12 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-1 text-muted-foreground shadow-sm backdrop-blur',
      className
    )}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex min-w-[120px] items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[hsl(var(--accent-foreground))] data-[state=active]:shadow',
      className
    )}
    {...props}
  />
);

export const TabsContent = ({ className, ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content
    className={cn('mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
    {...props}
  />
);
