import * as React from "react";
import { cn } from "@/lib/utils";

interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileCard({ className, ...props }: MobileCardProps) {
  return (
    <div
      className={cn(
        // Card-like on mobile
        "rounded-lg border bg-card text-card-foreground shadow-sm p-3",
        // Revert to plain container on md+
        "md:border-0 md:bg-transparent md:shadow-none md:p-0",
        className
      )}
      {...props}
    />
  );
}
