import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 focus-visible:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
