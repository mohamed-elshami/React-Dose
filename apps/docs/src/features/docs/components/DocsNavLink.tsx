"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type DocsNavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function DocsNavLink({ href, children }: DocsNavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`block rounded-md px-2 py-1.5 transition-colors ${
        active
          ? "bg-cyan-400/10 text-cyan-200"
          : "text-[var(--rd-muted)] hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
