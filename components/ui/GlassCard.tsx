import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl glass p-4",
        glow && "glow-border",
        className
      )}
    >
      {children}
    </div>
  );
}
