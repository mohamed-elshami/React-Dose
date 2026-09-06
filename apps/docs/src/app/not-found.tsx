import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Page not found",
  description: "The page you requested could not be found on React Dose.",
  path: "/404",
});

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
        404
      </p>
      <h1 className="font-display mt-3 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-[var(--rd-muted)]">
        That URL is not part of the React Dose docs.
      </p>
      <div className="mt-8 flex gap-4 text-sm">
        <Link href="/" className="text-cyan-300 underline-offset-4 hover:underline">
          Home
        </Link>
        <Link
          href="/docs"
          className="text-cyan-300 underline-offset-4 hover:underline"
        >
          Docs
        </Link>
      </div>
    </main>
  );
}
