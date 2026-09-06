import type { ReactNode } from "react";

type DocsArticleProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function DocsArticle({ title, description, children }: DocsArticleProps) {
  return (
    <article className="min-w-0 flex-1 pb-16">
      <header className="mb-8 border-b border-white/8 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base text-[var(--rd-muted)]">
            {description}
          </p>
        ) : null}
      </header>
      <div className="rd-prose max-w-3xl">{children}</div>
    </article>
  );
}
