'use client';

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "default" | "cta" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", href, children, ...props }, ref) => {
    const variantClass = variant === "cta" ? "btn-cta" : `btn-${variant}`;
    const sizeClass = `btn-${size}`;

    const buttonClass = cn("btn", variantClass, sizeClass, className);

    if (href) {
      return (
        <Link href={href} className={buttonClass}>
          {children}
        </Link>
      );
    }

    return (
      <button
        className={buttonClass}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
