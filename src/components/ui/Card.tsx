"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps
  extends Omit<
    HTMLMotionProps<"div"> & HTMLAttributes<HTMLDivElement>,
    "ref"
  > {
  variant?: "default" | "elevated" | "outlined";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const baseStyles = "rounded-xl overflow-hidden bg-white";

    const variants = {
      default: "shadow-md",
      elevated: "shadow-lg",
      outlined: "border border-accent",
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : undefined}
        transition={{ duration: 0.2 }}
        className={cn(
          baseStyles,
          variants[variant],
          hover && "cursor-pointer transition-shadow hover:shadow-xl",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-4 border-t border-accent/50", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

const CardImage = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { src: string; alt: string }
>(({ className, src, alt, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative w-full aspect-square overflow-hidden", className)}
    {...props}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    />
  </div>
));
CardImage.displayName = "CardImage";

export { Card, CardHeader, CardContent, CardFooter, CardImage };
export type { CardProps };
