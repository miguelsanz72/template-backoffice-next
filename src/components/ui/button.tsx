import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 cursor-pointer py-2.5 px-4 border border-transparent dark:border-transparent rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 cursor-pointer py-2.5 px-4 border border-transparent dark:border-transparent rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-destructive',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-input',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 cursor-pointer py-2.5 px-4 border border-transparent dark:border-transparent rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-secondary',
        ghost:
          'hover:bg-accent hover:text-accent-foreground cursor-pointer py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200',
        link: 'text-primary underline-offset-4 hover:underline cursor-pointer py-2.5 px-4 border border-transparent dark:border-transparent rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        success:
          'bg-emerald-500 text-white shadow hover:bg-emerald-600 cursor-pointer py-2.5 px-4 border border-transparent dark:border-transparent rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  capitalize?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, capitalize = true, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    // Aplicar clases específicas para botones con iconos
    const buttonClass = cn(buttonVariants({ variant, size, className }), {
      capitalize: capitalize,
      'p-0 flex items-center justify-center': size === 'icon',
    });

    return <Comp className={buttonClass} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
