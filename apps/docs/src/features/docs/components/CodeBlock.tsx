import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";

type CodeBlockProps = {
  children: string;
  language?: string;
  filename?: string;
};

const LANG_ALIASES: Record<string, string> = {
  text: "plaintext",
  bash: "bash",
  css: "css",
  tsx: "tsx",
  ts: "typescript",
  js: "javascript",
  jsx: "jsx",
};

export async function CodeBlock({
  children,
  language = "tsx",
  filename,
}: CodeBlockProps) {
  const code = children.replace(/^\n+|\n+$/g, "");
  const lang = LANG_ALIASES[language] ?? language;

  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark-default",
  });

  return (
    <div className="rd-code-block my-5 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-black/40 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-400">
          <span className="rounded bg-cyan-400/10 px-1.5 py-0.5 font-medium uppercase tracking-wide text-cyan-300">
            {language}
          </span>
          {filename ? (
            <span className="truncate font-mono text-zinc-500">{filename}</span>
          ) : null}
        </div>
        <CopyButton code={code} />
      </div>
      <div
        className="rd-shiki overflow-x-auto text-[0.85rem] leading-[1.65] [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-4!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
