import type { ReactNode } from "react";

type StackPanelProps = {
  title: string;
  badge: string;
  children: ReactNode;
};

export function StackPanel({ title, badge, children }: StackPanelProps) {
  return (
    <section className="rd-stack-panel my-6 overflow-hidden rounded-xl border border-white/10">
      <header className="flex flex-wrap items-center gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-3">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
          {badge}
        </span>
        <h3 className="m-0 text-base font-semibold text-white">{title}</h3>
      </header>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}
