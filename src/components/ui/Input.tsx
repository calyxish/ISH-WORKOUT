import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...rest }: Props) {
  return (
    <input
      className={`h-10 w-full rounded-xl border border-border-default bg-bg-input px-3 text-base text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none ${className}`}
      {...rest}
    />
  );
}
