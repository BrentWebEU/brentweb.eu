'use client';

import * as React from 'react';
import Link from 'next/link';
import { type VariantProps } from 'class-variance-authority';

import { buttonVariants } from './button-variants';

import { cn } from '@/lib/utils';


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    const buttonClass = cn(buttonVariants({ variant, size }), className);

    if (href) {
      return (
        <Link href={href} className={buttonClass}>
          {children}
        </Link>
      );
    }

    return (
      <button className={buttonClass} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
