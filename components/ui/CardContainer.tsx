import type { ReactNode } from "react";

type CardContainerProps = {
  children: ReactNode;
  className?: string;
};

export function CardContainer({ children, className = "" }: CardContainerProps) {
  return (
    <section
      className={`flex h-[430px] w-[430px] flex-col border border-black bg-white ${className}`.trim()}
    >
      {children}
    </section>
  );
}
