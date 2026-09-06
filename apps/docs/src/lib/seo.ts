import type { Metadata } from "next";
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  GITHUB_REPO,
  NPM_PACKAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
} from "./site";

export const defaultKeywords = [
  "React Dose",
  "create-react-dose",
  "React CLI",
  "Vite scaffold",
  "Next.js scaffold",
  "React Router scaffold",
  "feature-first React",
  "React architecture",
  "create-vite",
  "create-next-app",
  "Zustand",
  "Redux Toolkit",
  "Tailwind CSS",
  "next-intl",
  "i18next",
];

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = path === "/" ? `${SITE_NAME} · ${SITE_TAGLINE}` : title;

  return {
    title: path === "/" ? { absolute: fullTitle } : title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
    creator: AUTHOR_NAME,
    publisher: SITE_NAME,
    category: "technology",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: path.startsWith("/docs") ? "article" : "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: path === "/" ? fullTitle : `${title} · ${SITE_NAME}`,
      description,
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: path === "/" ? fullTitle : `${title} · ${SITE_NAME}`,
      description,
      images: [absoluteUrl("/og.png")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/react-dose.png"),
        sameAs: [GITHUB_REPO, NPM_PACKAGE, AUTHOR_URL],
        founder: {
          "@type": "Person",
          name: AUTHOR_NAME,
          url: AUTHOR_URL,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: "create-react-dose",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform",
        url: NPM_PACKAGE,
        downloadUrl: NPM_PACKAGE,
        installUrl: NPM_PACKAGE,
        softwareVersion: "1.0.1",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: {
          "@type": "Person",
          name: AUTHOR_NAME,
          url: AUTHOR_URL,
        },
        description: SITE_DESCRIPTION,
      },
    ],
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function techArticleJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/react-dose.png"),
      },
    },
    inLanguage: "en-US",
  };
}
