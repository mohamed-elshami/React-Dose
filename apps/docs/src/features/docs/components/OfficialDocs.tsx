import type { OfficialDocLink } from "../officialDocs.data";

type OfficialDocsProps = {
  links: OfficialDocLink[];
  title?: string;
};

export function OfficialDocs({
  links,
  title = "Official docs",
}: OfficialDocsProps) {
  if (links.length === 0) return null;

  return (
    <aside className="rd-official-docs my-6 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
        {title}
      </p>
      <ul className="m-0 list-none space-y-2 p-0">
        {links.map((link) => (
          <li key={link.href} className="m-0 text-sm text-[var(--rd-muted)]">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-200 underline decoration-cyan-400/40 underline-offset-3 hover:text-cyan-100"
            >
              {link.label}
            </a>
            {link.note ? (
              <span className="text-[var(--rd-muted)]"> — {link.note}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}
