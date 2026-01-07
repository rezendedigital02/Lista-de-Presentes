"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "warning";
  className?: string;
}

function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  variant = "primary",
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variants = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-accent rounded-full overflow-hidden", sizes[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", variants[variant])}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-sm text-text-muted">
          <span>{Math.round(percentage)}% arrecadado</span>
        </div>
      )}
    </div>
  );
}

export { ProgressBar };
export type { ProgressBarProps };
