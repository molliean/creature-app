import type { ReactNode } from "react";

type ButtonVariant = "default" | "action";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

export function Button({ children, variant = "default", className = "" }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-[10px] rounded-[13px] border px-4 py-2 text-[20px] leading-[1.049em] font-bold";

  const variantClasses =
    variant === "action"
      ? "border-[#989898] bg-[#D79E2D] text-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] px-[11px]"
      : "border-black bg-transparent text-black";

  return (
    <button
      className={`font-ligconsolata ${base} ${variantClasses} ${className}`.trim()}
      type="button"
    >
      {children}
    </button>
  );
}
