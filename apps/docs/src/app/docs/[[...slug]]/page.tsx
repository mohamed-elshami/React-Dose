import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsArticle, docsPages, resolveDocsSlug } from "@/features/docs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, buildPageMetadata, techArticleJsonLd } from "@/lib/seo";

type DocsCatchAllProps = {
  params: Promise<{ slug?: string[] }>;
};

function pathFromSlug(slug?: string[]) {
  if (!slug || slug.length === 0) return "/docs";
  return `/docs/${slug.join("/")}`;
}

export async function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["getting-started"] },
    { slug: ["stacks"] },
    { slug: ["options"] },
    { slug: ["options", "path"] },
    { slug: ["options", "framework"] },
    { slug: ["options", "architecture"] },
    { slug: ["options", "linter"] },
    { slug: ["options", "typescript"] },
    { slug: ["options", "react-compiler"] },
    { slug: ["options", "store"] },
    { slug: ["options", "tailwind"] },
    { slug: ["options", "i18n"] },
    { slug: ["architecture"] },
    { slug: ["environment"] },
  ];
}

export async function generateMetadata({
  params,
}: DocsCatchAllProps): Promise<Metadata> {
  const { slug } = await params;
  const key = resolveDocsSlug(slug);
  const page = docsPages[key];
  const path = pathFromSlug(slug);

  if (!page) {
    return buildPageMetadata({
      title: "Docs",
      description: "React Dose documentation",
      path,
    });
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path,
    keywords: [page.title, "React Dose docs", key],
  });
}

export default async function DocsCatchAllPage({ params }: DocsCatchAllProps) {
  const { slug } = await params;
  const key = resolveDocsSlug(slug);
  const page = docsPages[key];
  const path = pathFromSlug(slug);

  if (!page) {
    notFound();
  }

  const crumbs = [{ name: "Home", path: "/" }, { name: "Docs", path: "/docs" }];
  if (path !== "/docs") {
    crumbs.push({ name: page.title, path });
  }

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={techArticleJsonLd({
          title: page.title,
          description: page.description,
          path,
        })}
      />
      <DocsArticle title={page.title} description={page.description}>
        {page.body}
      </DocsArticle>
    </>
  );
}
