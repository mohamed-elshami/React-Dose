import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Dose",
  description: "Feature-first React ecosystem scaffolded with React Dose CLI.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
