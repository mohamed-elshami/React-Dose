import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/docs", label: "Docs" },
  {
    href: "https://www.npmjs.com/package/create-react-dose",
    label: "npm",
    external: true,
  },
  {
    href: "https://github.com/mohamed-elshami/React-Dose",
    label: "GitHub",
    external: true,
  },
];

type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  return (
    <header
      className={`relative z-20 border-b border-white/8 ${
        compact ? "bg-[var(--rd-bg)]/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="React Dose home">
          <Image
            src="/react-dose.png"
            alt=""
            width={36}
            height={36}
            className="rounded-full"
            priority
            sizes="36px"
          />
          <span className="font-display text-sm font-bold tracking-wide text-white">
            React Dose
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-5 text-sm text-[var(--rd-muted)]">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-cyan-300"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-cyan-300"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
