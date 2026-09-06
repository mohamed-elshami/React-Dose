import { SiteHeader } from "@/features/marketing";
import { DocsSidebar } from "@/features/docs";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[var(--rd-bg)] text-white">
      <SiteHeader compact />
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-8 lg:py-12">
        <DocsSidebar />
        {children}
      </div>
    </div>
  );
}
