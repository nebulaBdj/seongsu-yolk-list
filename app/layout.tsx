import type { Metadata, Viewport } from "next";
import { GA_ID, GSC_VERIFICATION, SITE } from "@/config/site";
import { nanumGothicCoding, spaceMono } from "@/lib/fonts";
import { SourceMemory } from "@/components/SourceMemory";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Where to Eat in Seongsu | The Yolk List", template: "%s | The Yolk List" },
  description: "Seongsu restaurants, bars and bakeries Korean diners rate highly, with what to order at each.",
  openGraph: { siteName: SITE.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  verification: GSC_VERIFICATION ? { google: GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#2D46F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${nanumGothicCoding.variable}`}>
      <head>
        {/* gtag: Google 스니펫 그대로 head에 둔다. Search Console을 GA 방식으로 확인하려면 head에 있어야 한다 (SPEC §9) */}
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\n\ngtag('config', '${GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        {children}
        <SourceMemory />
      </body>
    </html>
  );
}
