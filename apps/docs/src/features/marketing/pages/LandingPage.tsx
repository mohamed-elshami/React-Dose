import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";

const stacks = [
  {
    name: "Vite SPA",
    detail: "Official create-vite, then feature-first injection.",
  },
  {
    name: "React Router",
    detail: "Framework mode with routes under src/app.",
  },
  {
    name: "Next.js",
    detail: "App Router with thin pages and feature modules.",
  },
];

const steps = [
  {
    title: "Official scaffold",
    body: "We run Vite, create-next-app, or create-react-router first — pinned majors you already trust.",
  },
  {
    title: "Cleanup",
    body: "Demo noise goes away. Entries and folders align to a production layout.",
  },
  {
    title: "React Dose injection",
    body: "Features, providers, utilities, and a branded landing page from day one.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--rd-bg)] text-white">
      <SiteHeader />

      <main>
        <section className="rd-hero-atmosphere relative flex min-h-[calc(100vh-4rem)] items-center">
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center">
            <div className="rd-fade-up mb-8">
              <Image
                src="/react-dose.png"
                alt="React Dose"
                width={160}
                height={160}
                className="mx-auto rounded-full shadow-[0_0_32px_rgb(34_211_238_/_0.35)]"
                priority
                sizes="160px"
              />
            </div>

            <p className="rd-fade-up font-display mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              React Dose
            </p>

            <h1 className="rd-fade-up-delay font-display max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="rd-glow-text">Ship features,</span>
              <br />
              not boilerplate.
            </h1>

            <p className="rd-fade-up-delay-2 mt-5 max-w-xl text-base text-[var(--rd-muted)] sm:text-lg">
              Scaffold feature-first React apps on Vite, Next.js, or React
              Router — official tooling first, scalable architecture second.
            </p>

            <div className="rd-fade-up-delay-2 mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <code className="rd-btn-primary rounded-full border border-cyan-400/40 bg-black/70 px-5 py-3 text-sm text-cyan-100">
                npx create-react-dose@latest
              </code>
              <Link
                href="/docs"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-white/8 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--rd-muted)]">
              One CLI. Three official bases. A second layer of structure.
            </p>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    Step {index + 1}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--rd-muted)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-white/8 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Supported stacks
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--rd-muted)]">
              Pick a foundation. React Dose injects the same feature-first
              layout on top.
            </p>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {stacks.map((stack) => (
                <li key={stack.name} className="border-t border-cyan-400/25 pt-4">
                  <h3 className="font-display text-lg font-semibold">
                    {stack.name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--rd-muted)]">
                    {stack.detail}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <Link
                href="/docs/stacks"
                className="text-sm text-cyan-300 underline-offset-4 hover:underline"
              >
                Stack details in the docs
              </Link>
            </p>
          </div>
        </section>

        <footer className="border-t border-white/8 px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[var(--rd-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Created by{" "}
              <a
                href="https://github.com/mohamed-elshami"
                className="text-cyan-300 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Mohamed Samir Elshami
              </a>
            </p>
            <p>MIT · create-react-dose on npm</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
