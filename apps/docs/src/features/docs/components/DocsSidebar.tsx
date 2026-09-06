import { docsNav } from "../nav";
import { DocsNavLink } from "./DocsNavLink";

function DocsNav() {
  return (
    <nav aria-label="Documentation" className="space-y-6 text-sm">
      {docsNav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-300/80">
            {section.title}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <DocsNavLink href={item.href}>{item.label}</DocsNavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar() {
  return (
    <>
      <details className="group mb-4 lg:hidden">
        <summary className="cursor-pointer list-none rounded-md border border-white/10 px-3 py-2 text-sm text-[var(--rd-muted)] marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Docs menu</span>
          <span className="hidden group-open:inline">Hide menu</span>
        </summary>
        <div className="mt-4 border-b border-white/8 pb-4">
          <DocsNav />
        </div>
      </details>

      <aside className="hidden w-56 shrink-0 lg:block">
        <DocsNav />
      </aside>
    </>
  );
}
