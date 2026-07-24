import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 text-zinc-700 ring-zinc-200",
        trusted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        low: "bg-sky-50 text-sky-700 ring-sky-200",
        medium: "bg-amber-50 text-amber-700 ring-amber-200",
        high: "bg-orange-50 text-orange-700 ring-orange-200",
        critical: "bg-red-50 text-red-700 ring-red-200",
        match: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        partial: "bg-amber-50 text-amber-700 ring-amber-200",
        mismatch: "bg-red-50 text-red-700 ring-red-200",
        undisclosed: "bg-zinc-100 text-zinc-600 ring-zinc-200",
        outline: "bg-transparent ring-zinc-300 text-zinc-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
