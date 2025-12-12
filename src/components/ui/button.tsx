import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-soft hover:shadow-glow hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl",
        ghost: "hover:bg-muted hover:text-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-lg hover:shadow-glow hover:-translate-y-1 text-base font-bold",
        "hero-outline": "border-2 border-primary/30 bg-card/80 backdrop-blur-sm text-foreground hover:border-primary hover:bg-primary/10 rounded-2xl text-base font-bold",
        playful: "bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-2xl shadow-soft hover:shadow-glow hover:-translate-y-1 hover:scale-105",
        sky: "bg-sky text-sky-foreground hover:bg-sky/90 rounded-xl shadow-soft hover:-translate-y-0.5",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl shadow-soft hover:-translate-y-0.5",
        violet: "bg-violet text-violet-foreground hover:bg-violet/90 rounded-xl shadow-soft hover:-translate-y-0.5",
        sunshine: "bg-sunshine text-sunshine-foreground hover:bg-sunshine/90 rounded-xl shadow-soft hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
