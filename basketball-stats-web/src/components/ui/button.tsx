import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basketball-home disabled:pointer-events-none disabled:opacity-50 text-lg min-h-[48px] min-w-[48px] px-4 py-2",
  {
    variants: {
      variant: {
        default: "bg-basketball-home text-white hover:bg-basketball-home/90",
        destructive: "bg-basketball-miss text-white hover:bg-basketball-miss/90",
        outline:
          "border border-basketball-border bg-transparent text-basketball-text hover:bg-basketball-surface",
        secondary: "bg-basketball-surface text-basketball-text hover:bg-basketball-border",
        ghost: "text-basketball-text hover:bg-basketball-surface",
        success: "bg-basketball-success text-white hover:bg-basketball-success/90",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-10 px-3 text-base",
        lg: "h-14 px-6 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
