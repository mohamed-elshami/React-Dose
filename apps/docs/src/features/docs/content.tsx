import type { ReactNode } from "react";
import { CodeBlock } from "./components/CodeBlock";
import { OfficialDocs } from "./components/OfficialDocs";
import { StackPanel } from "./components/StackPanel";
import { officialDocs } from "./officialDocs.data";

export type DocsPageContent = {
  title: string;
  description: string;
  body: ReactNode;
};

export const docsPages: Record<string, DocsPageContent> = {
  introduction: {
    title: "Introduction",
    description:
      "React Dose is a feature-first scaffolding toolchain for React. It does not replace Vite, Next.js, or React Router — it builds on top of them.",
    body: (
      <>
        <p>
          Run the CLI once to create a project. Official scaffolders run first
          with pinned, compatible majors. Then React Dose applies cleanup and
          architecture injection so every app starts with a clear{" "}
          <code>app</code> / <code>features</code> / <code>utils</code> layout.
        </p>
        <h2>Primary command</h2>
        <CodeBlock language="bash">npx create-react-dose@latest</CodeBlock>
        <p>You can also use:</p>
        <CodeBlock language="bash">{`npm create react-dose@latest
npx create-react-dose@latest ./my-app`}</CodeBlock>
        <h2>What you keep</h2>
        <ul>
          <li>Official Vite, Next.js, or React Router tooling</li>
          <li>Ecosystem docs and upgrade paths for those tools</li>
        </ul>
        <h2>What you gain</h2>
        <ul>
          <li>Feature modules that scale with your domain</li>
          <li>Root provider composition wired from day one</li>
          <li>Shared utilities and a branded landing page</li>
        </ul>
        <OfficialDocs
          title="Official framework docs"
          links={[
            officialDocs.react,
            officialDocs.vite,
            officialDocs.nextjs,
            officialDocs.reactRouter,
          ]}
        />
      </>
    ),
  },
  "getting-started": {
    title: "Getting started",
    description: "Create your first React Dose project in a few prompts.",
    body: (
      <>
        <h2>Prerequisites</h2>
        <ul>
          <li>Node.js 18+</li>
          <li>npm, pnpm, or yarn (auto-detected for install)</li>
        </ul>
        <h2>Create a project</h2>
        <CodeBlock language="bash">npx create-react-dose@latest</CodeBlock>
        <p>Or pass a folder path:</p>
        <CodeBlock language="bash">
          npx create-react-dose@latest ./my-app
        </CodeBlock>
        <p>Follow the interactive prompts, then:</p>
        <CodeBlock language="bash">{`cd my-app
npm run dev`}</CodeBlock>
        <h2>What happens under the hood</h2>
        <ol>
          <li>Official scaffolder downloads (Vite / Next / React Router)</li>
          <li>Boilerplate cleanup and entry alignment</li>
          <li>React Dose architecture, features, and polish injection</li>
          <li>Dependency install for your package manager</li>
        </ol>
        <OfficialDocs
          links={[
            { ...officialDocs.nodejs, note: "runtime requirement" },
            officialDocs.createVite,
            officialDocs.createNextApp,
            officialDocs.createReactRouter,
          ]}
        />
      </>
    ),
  },
  stacks: {
    title: "Supported stacks",
    description:
      "Three official bases. Pick one path — Vite SPA, React Router, or Next — then Dose injects architecture for that stack only.",
    body: (
      <>
        <p>
          Docs for optional features (i18n, store, Tailwind) are split by stack
          so Vite/React and Next stay separate.
        </p>

        <StackPanel title="Vite SPA" badge="React + Vite">
          <ul>
            <li>
              Base: <code>npm create vite</code>
            </li>
            <li>
              Entry: <code>src/app/main.tsx</code> + <code>App.tsx</code>
            </li>
            <li>Optional ESLint or Oxlint</li>
            <li>
              Optional features from <code>templates/react/*</code>
            </li>
          </ul>
          <OfficialDocs links={[officialDocs.vite, officialDocs.createVite]} />
        </StackPanel>

        <StackPanel title="React Router v7" badge="React + Router">
          <ul>
            <li>
              Base: <code>npx create-react-router</code>
            </li>
            <li>
              App dir: <code>src/app/</code> with file routes
            </li>
            <li>No Vite linter or React Compiler prompt</li>
            <li>
              Same react-i18next / Zustand patterns as Vite when those options
              are on
            </li>
          </ul>
          <OfficialDocs
            links={[officialDocs.reactRouter, officialDocs.createReactRouter]}
          />
        </StackPanel>

        <StackPanel title="Next.js App Router" badge="Next.js">
          <ul>
            <li>
              Base: <code>npx create-next-app</code> (
              <code>--app --src-dir</code>)
            </li>
            <li>Always ESLint</li>
            <li>
              i18n uses <code>next-intl</code> + <code>[locale]</code> — not
              i18next
            </li>
            <li>Redux uses a Next-safe <code>makeStore()</code> provider</li>
          </ul>
          <OfficialDocs
            links={[officialDocs.nextjs, officialDocs.createNextApp]}
          />
        </StackPanel>
      </>
    ),
  },
  options: {
    title: "Interactive options",
    description:
      "Every prompt the CLI asks, what it controls, and when it appears.",
    body: (
      <>
        <table>
          <thead>
            <tr>
              <th>Prompt</th>
              <th>Options</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Project path</td>
              <td>Any folder</td>
              <td>Always (unless passed as an argument)</td>
            </tr>
            <tr>
              <td>Framework</td>
              <td>React-vite · Next-app</td>
              <td>Always</td>
            </tr>
            <tr>
              <td>Architecture</td>
              <td>SPA · React Router</td>
              <td>React-vite only</td>
            </tr>
            <tr>
              <td>Linter</td>
              <td>ESLint · Oxlint</td>
              <td>Vite SPA only</td>
            </tr>
            <tr>
              <td>TypeScript</td>
              <td>Yes / No</td>
              <td>Always</td>
            </tr>
            <tr>
              <td>React Compiler</td>
              <td>Yes / No</td>
              <td>Not offered for React Router</td>
            </tr>
            <tr>
              <td>State</td>
              <td>None · Zustand · Redux Toolkit</td>
              <td>Always</td>
            </tr>
            <tr>
              <td>Tailwind CSS</td>
              <td>Yes / No</td>
              <td>Always</td>
            </tr>
            <tr>
              <td>i18n</td>
              <td>Yes / No</td>
              <td>Always</td>
            </tr>
          </tbody>
        </table>
        <p>
          Open each option page for stack-separated file lists, usage examples,
          and links to each library&apos;s official docs.
        </p>
        <OfficialDocs
          title="Libraries covered in option docs"
          links={[
            officialDocs.typescript,
            officialDocs.eslint,
            officialDocs.oxlint,
            officialDocs.reactCompiler,
            officialDocs.zustand,
            officialDocs.reduxToolkit,
            officialDocs.tailwind,
            officialDocs.i18next,
            officialDocs.nextIntl,
          ]}
        />
      </>
    ),
  },
  "options-path": {
    title: "Project path",
    description: "Where the new app folder is created on disk.",
    body: (
      <>
        <p>
          Defaults to <code>./my-react-dose-app</code>. Pass a path to skip the
          prompt:
        </p>
        <CodeBlock language="bash">
          npx create-react-dose@latest ./my-app
        </CodeBlock>
        <h2>What the CLI does</h2>
        <ul>
          <li>Uses that folder as the official scaffolder target</li>
          <li>Skips the path prompt when an argument is provided</li>
          <li>
            You <code>cd</code> into it afterward for <code>dev</code> /{" "}
            <code>build</code>
          </li>
        </ul>
      </>
    ),
  },
  "options-framework": {
    title: "Framework",
    description: "React-vite vs Next-app — pick one path; features diverge after this.",
    body: (
      <>
        <StackPanel title="React-vite" badge="react-core">
          <ul>
            <li>
              Runs Vite or React Router depending on Architecture
            </li>
            <li>Architecture + Vite linter prompts appear next</li>
            <li>
              Feature templates live under <code>templates/react/</code>
            </li>
          </ul>
          <OfficialDocs
            links={[
              officialDocs.vite,
              officialDocs.reactRouter,
              officialDocs.createVite,
              officialDocs.createReactRouter,
            ]}
          />
        </StackPanel>
        <StackPanel title="Next-app" badge="next-core">
          <ul>
            <li>
              Runs <code>create-next-app</code> with App Router +{" "}
              <code>src/</code>
            </li>
            <li>No Architecture / Vite linter prompts; ESLint always on</li>
            <li>
              Feature templates live under <code>templates/next/</code>
            </li>
          </ul>
          <OfficialDocs
            links={[officialDocs.nextjs, officialDocs.createNextApp]}
          />
        </StackPanel>
      </>
    ),
  },
  "options-architecture": {
    title: "Architecture",
    description: "React-vite only: SPA vs React Router. Next skips this prompt.",
    body: (
      <>
        <StackPanel title="React SPA" badge="Vite">
          <ul>
            <li>
              Base: <code>create-vite</code>
            </li>
            <li>
              Key files: <code>src/app/main.*</code>, <code>src/app/App.*</code>
            </li>
            <li>
              <code>RootProvider</code> wraps the app in <code>main.*</code>
            </li>
            <li>Linter + React Compiler prompts apply</li>
          </ul>
          <OfficialDocs links={[officialDocs.vite, officialDocs.createVite]} />
        </StackPanel>
        <StackPanel title="React Router" badge="Router">
          <ul>
            <li>
              Base: <code>create-react-router</code>
            </li>
            <li>
              Key files: <code>src/app/root.*</code>,{" "}
              <code>src/app/routes/home.*</code>
            </li>
            <li>
              <code>RootProvider</code> wraps <code>&lt;Outlet /&gt;</code>
            </li>
            <li>No Vite linter or React Compiler prompts</li>
          </ul>
          <OfficialDocs
            links={[officialDocs.reactRouter, officialDocs.createReactRouter]}
          />
        </StackPanel>
        <p>
          Next-app uses <code>architectureFlavor: &quot;none&quot;</code> — this
          page does not apply.
        </p>
      </>
    ),
  },
  "options-linter": {
    title: "Linter",
    description: "Vite SPA only. Next and Router are handled differently.",
    body: (
      <>
        <StackPanel title="Vite SPA" badge="React + Vite">
          <table>
            <thead>
              <tr>
                <th>Choice</th>
                <th>Flag</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ESLint</td>
                <td>
                  <code>--eslint</code>
                </td>
                <td>
                  <code>eslint.config.js</code> + <code>npm run lint</code>
                </td>
              </tr>
              <tr>
                <td>Oxlint</td>
                <td>
                  <code>--no-eslint</code>
                </td>
                <td>
                  <code>.oxlintrc.json</code> + <code>oxlint</code>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Dose only passes the flag through — no extra lint config beyond the
            official Vite template.
          </p>
          <OfficialDocs links={[officialDocs.eslint, officialDocs.oxlint]} />
        </StackPanel>
        <StackPanel title="Next.js" badge="Next.js">
          <p>
            Always <code>--eslint</code> with <code>eslint-config-next</code>.
            There is no Oxlint option.
          </p>
          <OfficialDocs
            links={[officialDocs.eslint, officialDocs.eslintConfigNext]}
          />
        </StackPanel>
        <StackPanel title="React Router" badge="Router">
          <p>
            No linter prompt. Keep whatever <code>create-react-router</code>{" "}
            ships.
          </p>
          <OfficialDocs links={[officialDocs.createReactRouter]} />
        </StackPanel>
      </>
    ),
  },
  "options-typescript": {
    title: "TypeScript",
    description: "JS or TS templates for the whole project.",
    body: (
      <>
        <p>
          Defaults to <strong>Yes</strong>. Selects <code>ts/</code> vs{" "}
          <code>js/</code> trees for shared templates and features.
        </p>
        <StackPanel title="Vite SPA" badge="React + Vite">
          <ul>
            <li>
              May copy tuned <code>tsconfig.app.json</code> with{" "}
              <code>@/*</code>
            </li>
            <li>
              Ensures <code>@types/react</code> packages when missing
            </li>
            <li>
              JS mode: <code>build</code> becomes <code>vite build</code> (no{" "}
              <code>tsc</code>)
            </li>
          </ul>
        </StackPanel>
        <StackPanel title="React Router" badge="Router">
          <ul>
            <li>Official scaffold is TS-first</li>
            <li>
              JS mode: Dose converts sources and keeps <code>allowJs</code>{" "}
              tsconfig
            </li>
          </ul>
        </StackPanel>
        <StackPanel title="Next.js" badge="Next.js">
          <ul>
            <li>
              <code>create-next-app --ts</code> or <code>--js</code>
            </li>
          </ul>
        </StackPanel>
        <OfficialDocs links={[officialDocs.typescript]} />
      </>
    ),
  },
  "options-react-compiler": {
    title: "React Compiler",
    description: "Official compiler support — stack-specific flags only.",
    body: (
      <>
        <p>
          Defaults to <strong>Yes</strong> when shown.{" "}
          <strong>Not offered for React Router.</strong>
        </p>
        <StackPanel title="Vite SPA" badge="React + Vite">
          <ul>
            <li>
              Templates: <code>react-compiler</code> /{" "}
              <code>react-compiler-ts</code>
            </li>
            <li>
              Dose may add <code>reactCompilerPreset</code> in{" "}
              <code>vite.config</code>
            </li>
          </ul>
        </StackPanel>
        <StackPanel title="Next.js" badge="Next.js">
          <ul>
            <li>
              Passes <code>--react-compiler</code> to{" "}
              <code>create-next-app</code>
            </li>
            <li>
              Keeps <code>reactCompiler: true</code> in <code>next.config</code>{" "}
              when opted in
            </li>
          </ul>
        </StackPanel>
        <StackPanel title="React Router" badge="Router">
          <p>Prompt is skipped — compiler stays off.</p>
        </StackPanel>
        <OfficialDocs
          links={[
            officialDocs.reactCompiler,
            {
              ...officialDocs.nextjs,
              note: "Next.js --react-compiler flag",
            },
          ]}
        />
      </>
    ),
  },
  "options-store": {
    title: "State store",
    description:
      "Zustand and Redux — files and usage, separated by Vite/React vs Next.",
    body: (
      <>
        <p>
          Choose None, Zustand, or Redux Toolkit. Patterns below are split by
          stack.
        </p>

        <h2>Zustand</h2>
        <StackPanel title="Vite SPA & React Router" badge="React">
          <p>File injected:</p>
          <CodeBlock language="text" filename="src/app/store/useCounterStore.ts">
            {`src/app/store/useCounterStore.ts`}
          </CodeBlock>
          <p>
            No provider — import the hook anywhere. Persist key:{" "}
            <code>react-dose-counter-storage</code>.
          </p>
          <OfficialDocs links={[officialDocs.zustand]} />
          <CodeBlock language="tsx" filename="example.tsx">{`import { useCounterStore } from "@/app/store/useCounterStore";

export function Counter() {
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);

  return (
    <button type="button" onClick={increment}>
      {count}
    </button>
  );
}`}</CodeBlock>
        </StackPanel>
        <StackPanel title="Next.js" badge="Next.js">
          <p>
            Same store file and API as Vite. Still no provider — it is a client
            hook with <code>localStorage</code> persist. Use it from Client
            Components.
          </p>
          <OfficialDocs links={[officialDocs.zustand]} />
          <CodeBlock language="tsx" filename="Counter.tsx">{`"use client";

import { useCounterStore } from "@/app/store/useCounterStore";

export function Counter() {
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  return <button onClick={increment}>{count}</button>;
}`}</CodeBlock>
        </StackPanel>

        <h2>Redux Toolkit</h2>
        <StackPanel title="Vite SPA & React Router" badge="React">
          <p>Files injected:</p>
          <CodeBlock language="text">{`src/app/store/store.ts
src/app/store/hooks.ts
src/app/store/slices/counterSlice.ts
src/app/providers/redux-provider.tsx`}</CodeBlock>
          <p>
            Singleton <code>store</code>. Nested in <code>RootProvider</code> as{" "}
            <code>&lt;ReduxProvider&gt;</code>.
          </p>
          <OfficialDocs
            links={[officialDocs.reduxToolkit, officialDocs.reactRedux]}
          />
          <CodeBlock language="tsx" filename="example.tsx">{`import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { increment } from "@/app/store/slices/counterSlice";

export function Counter() {
  const count = useAppSelector((s) => s.counter.count);
  const dispatch = useAppDispatch();

  return (
    <button type="button" onClick={() => dispatch(increment())}>
      {count}
    </button>
  );
}`}</CodeBlock>
        </StackPanel>
        <StackPanel title="Next.js" badge="Next.js">
          <p>Same file set, but store creation is Next-safe:</p>
          <ul>
            <li>
              <code>makeStore()</code> instead of a module singleton
            </li>
            <li>
              Client <code>redux-provider</code> keeps one store in{" "}
              <code>useRef</code>
            </li>
            <li>
              Still nested under <code>RootProvider</code>
            </li>
          </ul>
          <p>
            Usage of <code>useAppDispatch</code> / <code>useAppSelector</code>{" "}
            is the same in Client Components.
          </p>
          <OfficialDocs
            links={[officialDocs.reduxToolkit, officialDocs.reactRedux]}
          />
        </StackPanel>
      </>
    ),
  },
  "options-tailwind": {
    title: "Tailwind CSS",
    description: "Enable/strip behavior — Vite, Router, and Next kept separate.",
    body: (
      <>
        <p>Defaults to Yes. Official integrations differ per stack.</p>

        <StackPanel title="Vite SPA" badge="React + Vite">
          <p>
            <strong>Enabled</strong>
          </p>
          <ul>
            <li>
              Deps: <code>tailwindcss</code>, <code>@tailwindcss/vite</code>
            </li>
            <li>
              File: <code>src/app/index.css</code> with{" "}
              <code>@import &quot;tailwindcss&quot;</code>
            </li>
            <li>
              Plugin in <code>vite.config</code>; imported from{" "}
              <code>main.*</code>
            </li>
          </ul>
          <CodeBlock language="css" filename="src/app/index.css">{`@import "tailwindcss";`}</CodeBlock>
          <p>
            <strong>Disabled</strong> — those deps removed; CSS cleaned up.
          </p>
          <OfficialDocs
            links={[officialDocs.tailwind, officialDocs.tailwindVite]}
          />
        </StackPanel>

        <StackPanel title="React Router" badge="Router">
          <ul>
            <li>
              Official scaffold already includes Tailwind — Dose does not copy a
              separate feature template
            </li>
            <li>
              Opt-out: strip Vite plugin, clear <code>src/app/app.css</code>,
              remove deps
            </li>
          </ul>
          <OfficialDocs
            links={[officialDocs.tailwind, officialDocs.tailwindVite]}
          />
        </StackPanel>

        <StackPanel title="Next.js" badge="Next.js">
          <ul>
            <li>
              Comes from <code>create-next-app --tailwind</code> /{" "}
              <code>--no-tailwind</code>
            </li>
            <li>
              Opt-in polish on <code>src/app/globals.css</code>
            </li>
            <li>
              Opt-out removes Tailwind/postcss and empties globals when cleaned
            </li>
          </ul>
          <CodeBlock language="css" filename="src/app/globals.css">{`@import "tailwindcss";`}</CodeBlock>
          <OfficialDocs links={[officialDocs.tailwind]} />
        </StackPanel>
      </>
    ),
  },
  "options-i18n": {
    title: "i18n",
    description:
      "Vite/React uses i18next. Next uses next-intl. Sections below are separate — do not mix APIs.",
    body: (
      <>
        <p>
          Defaults to No. When enabled, Dose injects a{" "}
          <strong>stack-native</strong> setup. Use only the section that matches
          your project.
        </p>

        <StackPanel title="Vite SPA & React Router" badge="React + i18next">
          <p>
            Libraries: <code>i18next</code> + <code>react-i18next</code>. Locale
            is <strong>not</strong> in the URL. Persist via{" "}
            <code>localStorage.lang</code>.
          </p>
          <OfficialDocs
            links={[officialDocs.i18next, officialDocs.reactI18next]}
          />
          <h4 className="mb-2 mt-4 text-sm font-semibold text-white">
            Files injected
          </h4>
          <CodeBlock language="text">{`src/i18n/index.ts
src/i18n/locales/en.json
src/i18n/locales/ar.json
src/hooks/useLocale.ts
src/i18n/i18next.d.ts          # TypeScript only`}</CodeBlock>
          <h4 className="mb-2 mt-4 text-sm font-semibold text-white">
            What we wire
          </h4>
          <ul>
            <li>
              <code>RootProvider</code> →{" "}
              <code>&lt;I18nextProvider i18n=&#123;i18n&#125;&gt;</code>
            </li>
            <li>
              Entry imports <code>@/i18n</code> from <code>main.*</code> (SPA) or{" "}
              <code>root.*</code> (Router)
            </li>
            <li>
              Locales <code>en</code> / <code>ar</code>, fallback{" "}
              <code>en</code>
            </li>
          </ul>
          <h4 className="mb-2 mt-4 text-sm font-semibold text-white">
            Helper hook — useLocale
          </h4>
          <CodeBlock language="tsx" filename="Component.tsx">{`import { useLocale } from "@/hooks/useLocale";

export function LanguageSwitcher() {
  const { t, changeLanguage, currentLanguage } = useLocale();

  return (
    <div>
      <p>{t("welcome")}</p>
      <p>Current: {currentLanguage}</p>
      <button type="button" onClick={() => changeLanguage("ar")}>
        العربية
      </button>
      <button type="button" onClick={() => changeLanguage("en")}>
        English
      </button>
    </div>
  );
}`}</CodeBlock>
          <p>
            <code>changeLanguage</code> writes <code>localStorage.lang</code>{" "}
            then calls <code>i18n.changeLanguage</code>. Add keys under{" "}
            <code>src/i18n/locales/*.json</code>. You can also use{" "}
            <code>useTranslation()</code> from <code>react-i18next</code>.
          </p>
        </StackPanel>

        <StackPanel title="Next.js App Router" badge="Next + next-intl">
          <p>
            Library: <code>next-intl</code>. Locales live in the URL (
            <code>/en/...</code>, <code>/ar/...</code>). Do{" "}
            <strong>not</strong> use the Vite <code>useLocale</code> hook here.
          </p>
          <OfficialDocs links={[officialDocs.nextIntl]} />
          <h4 className="mb-2 mt-4 text-sm font-semibold text-white">
            Files injected
          </h4>
          <CodeBlock language="text">{`messages/en.json
messages/ar.json
src/i18n/routing.ts
src/i18n/navigation.ts
src/i18n/request.ts
src/proxy.ts
src/app/layout.tsx
src/app/page.tsx
src/app/[locale]/layout.tsx
src/app/[locale]/page.tsx
next.config.ts`}</CodeBlock>
          <h4 className="mb-2 mt-4 text-sm font-semibold text-white">
            What we wire
          </h4>
          <ul>
            <li>
              <code>[locale]/layout</code> wraps{" "}
              <code>NextIntlClientProvider</code> via <code>RootProvider</code>
            </li>
            <li>
              Root <code>/</code> redirects to <code>/&#123;locale&#125;</code>
            </li>
            <li>
              <code>html</code> gets <code>lang</code> + <code>dir</code> (
              <code>ar</code> → RTL)
            </li>
            <li>
              <code>next.config</code> uses <code>createNextIntlPlugin()</code>
            </li>
          </ul>
          <h4 className="mb-2 mt-4 text-sm font-semibold text-white">
            Navigation — use @/i18n/navigation
          </h4>
          <CodeBlock language="tsx" filename="NavLink.tsx">{`import { Link, useRouter, usePathname } from "@/i18n/navigation";

export function NavLink() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Link href="/about">About</Link>
      <button type="button" onClick={() => router.push("/contact")}>
        Contact ({pathname})
      </button>
    </>
  );
}`}</CodeBlock>
          <p>
            Prefer these helpers over <code>next/link</code> and{" "}
            <code>next/navigation</code> so the active locale stays in the URL.
          </p>
          <h4 className="mb-2 mt-4 text-sm font-semibold text-white">
            Translations — next-intl APIs
          </h4>
          <CodeBlock language="tsx" filename="Welcome.tsx">{`import { useTranslations, useLocale } from "next-intl";

export function Welcome() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <p>
      {t("welcome")} — {locale}
    </p>
  );
}`}</CodeBlock>
          <p>
            Add messages in <code>messages/en.json</code> and{" "}
            <code>messages/ar.json</code>. Server layouts use{" "}
            <code>getMessages</code> / <code>setRequestLocale</code> as in the
            generated <code>[locale]/layout</code>.
          </p>
        </StackPanel>
      </>
    ),
  },
  architecture: {
    title: "Feature-first layout",
    description:
      "Three zones shared by every stack, with stack-specific shell files.",
    body: (
      <>
        <CodeBlock language="text">{`src/
├── app/         # Shell — routing, layout, providers, global styles
├── features/    # Domain modules — one folder per feature
└── utils/       # Shared non-UI helpers`}</CodeBlock>
        <h2>Always injected</h2>
        <ul>
          <li>
            <code>src/features/home/</code> — HomePage, creator links
          </li>
          <li>
            <code>src/utils/cookies</code>, <code>localStorage</code>
          </li>
          <li>
            <code>src/app/providers/root-provider</code>
          </li>
        </ul>
        <StackPanel title="Vite SPA shell" badge="React + Vite">
          <CodeBlock language="text">{`src/app/main.tsx
src/app/App.tsx
src/app/providers/root-provider.tsx`}</CodeBlock>
          <OfficialDocs links={[officialDocs.vite]} />
        </StackPanel>
        <StackPanel title="React Router shell" badge="Router">
          <CodeBlock language="text">{`src/app/root.tsx
src/app/routes/home.tsx
src/app/providers/root-provider.tsx
react-router.config.ts`}</CodeBlock>
          <OfficialDocs links={[officialDocs.reactRouter]} />
        </StackPanel>
        <StackPanel title="Next.js shell" badge="Next.js">
          <CodeBlock language="text">{`src/app/layout.tsx
src/app/page.tsx
src/app/providers/root-provider.tsx
# with i18n → src/app/[locale]/layout.tsx + page.tsx`}</CodeBlock>
          <OfficialDocs links={[officialDocs.nextjs]} />
        </StackPanel>
      </>
    ),
  },
  environment: {
    title: "Environment variables",
    description: "Optional overrides used by the CLI itself.",
    body: (
      <>
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>REACT_DOSE_SCAFFOLD_LATEST=1</code>
              </td>
              <td>
                Use <code>@latest</code> for official scaffolders instead of
                pinned majors (testing only)
              </td>
            </tr>
            <tr>
              <td>
                <code>CI=1</code>
              </td>
              <td>Non-interactive spinner behavior in CI</td>
            </tr>
          </tbody>
        </table>
        <CodeBlock language="bash">{`REACT_DOSE_SCAFFOLD_LATEST=1 npx create-react-dose@latest`}</CodeBlock>
      </>
    ),
  },
};

export function resolveDocsSlug(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) {
    return "introduction";
  }

  if (segments[0] === "options" && segments.length === 1) {
    return "options";
  }

  if (segments[0] === "options" && segments[1]) {
    return `options-${segments[1]}`;
  }

  return segments.join("-");
}
