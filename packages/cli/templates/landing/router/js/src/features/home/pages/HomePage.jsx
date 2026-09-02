import "../home.css";
import logo from "../assets/react-dose.webp";
import { CreatorLinks } from "../CreatorLinks.jsx";

const stackPaths = [
  {
    label: "app",
    title: "App shell",
    path: "src/app/",
    description: "Root layout, routes, providers, and global styles.",
  },
  {
    label: "features",
    title: "Features",
    path: "src/features/",
    description: "Domain UI, hooks, and services — one folder per feature.",
  },
  {
    label: "utils",
    title: "Utilities",
    path: "src/utils/",
    description: "Cookies, localStorage, and shared helpers for the app.",
  },
];

const docLinks = [
  { href: "https://reactrouter.com", label: "React Router docs", primary: true },
  { href: "https://react.dev", label: "React docs" },
  { href: "https://vite.dev", label: "Vite docs" },
];

export default function HomePage() {
  return (
    <main className="rd-home rd-hero-screen min-h-screen h-screen overflow-hidden bg-black text-white">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-10 px-8 lg:flex-row lg:gap-16">
        <div className="flex shrink-0 flex-col items-center justify-center gap-6">
          <div className="rd-logo-ring">
            <img
              src={logo}
              alt="React Dose logo"
              className="h-48 w-48 rounded-full object-cover lg:h-52 lg:w-52"
            />
          </div>
          <CreatorLinks />
        </div>

        <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-5 inline-block rounded-full border border-cyan-400/30 bg-black/60 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            React Router v7
          </span>

          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
            <span className="text-white">React </span>
            <span className="rd-glow-text text-cyan-400">Dose</span>
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Feature-first React ecosystem. Shell in{" "}
            <code className="font-mono text-cyan-400/90">src/app</code>, product
            code in{" "}
            <code className="font-mono text-cyan-400/90">src/features</code>.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {stackPaths.map((item) => (
              <div key={item.path} className="rd-path-card">
                <span className="rd-path-label">{item.title}</span>
                <p className="rd-path-desc">{item.description}</p>
                <span className="rd-path-value">{item.path}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {docLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={
                  link.primary
                    ? "rd-btn-primary inline-flex items-center rounded-xl border border-cyan-400/60 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:border-cyan-400 hover:bg-cyan-400/10"
                    : "inline-flex items-center rounded-xl border border-cyan-400/40 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:border-cyan-400 hover:bg-cyan-400/10"
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="mt-10 text-2xs-footer text-zinc-500">
            Edit{" "}
            <code className="font-mono text-cyan-400/80">
              src/features/home/pages/HomePage.jsx
            </code>
          </p>
        </div>
      </div>
    </main>
  );
}
