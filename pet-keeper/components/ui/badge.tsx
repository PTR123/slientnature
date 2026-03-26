import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-forest-600 text-white',
        secondary: 'border-transparent bg-amber-100 text-amber-900',
        destructive: 'border-transparent bg-red-500 text-white',
        beginner: 'border-transparent bg-moss-100 text-moss-700 border-moss-300',
        intermediate: 'border-transparent bg-amber-100 text-amber-700 border-amber-300',
        advanced: 'border-transparent bg-terracotta-100 text-terracotta-700 border-terracotta-300',
        outline: 'text-forest-700 border-forest-300'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };