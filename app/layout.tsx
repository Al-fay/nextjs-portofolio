import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://alfay-portofolio.vercel.app/";

const TITLE = "Diva Alfahrizy | Mid-level Fullstack Engineer & UI/UX Architect";
const DESCRIPTION =
  "Portfolio Diva Alfahrizy, Mid-level Fullstack Engineer & UI/UX Architect asal Pekalongan, Indonesia. Spesialis aplikasi real-time, arsitektur serverless, dan landing page modern dengan React, Next.js, dan TypeScript.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Diva Alfahrizy",
  },
  description: DESCRIPTION,
  icons: {
    icon: "/assets/images/developer_avatar_1779937938255.png",
    shortcut: "/assets/images/developer_avatar_1779937938255.png",
    apple: "/assets/images/developer_avatar_1779937938255.png",
  },
  keywords: [
    "Diva Alfahrizy",
    "Alfay",
    "Fullstack Engineer",
    "UI/UX Architect",
    "Web Developer Indonesia",
    "Freelance Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Muhammad Diva Alfahrizy", url: SITE_URL }],
  creator: "Muhammad Diva Alfahrizy",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Diva Alfahrizy",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["id_ID"],
    images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Diva Alfahrizy",
  alternateName: "Alfay",
  jobTitle: "Fullstack Engineer & UI/UX Architect",
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pekalongan",
    addressCountry: "ID",
  },
  sameAs: [
    "https://github.com/Al-Fay",
    "https://www.linkedin.com/in/muhammad-diva-alfahrizy-1422ba208/",
  ],
  knowsAbout: ["React", "Next.js", "TypeScript", "UI/UX Design"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
