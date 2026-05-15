import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { METADATA } from "@/shared/constants/metadata";
import { SERVER_ENV } from "@/shared/constants/server-env";
import { getCanonicalUrl, getRobots, getServerDeviceInfo, getPackageVersion } from "@/shared/utils/server-util";
import Provider from "./_providers";
import React from "react";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

type TemplateString = {
  template: string;
  default: string;
};

const TITLE: TemplateString = {
  template: `${METADATA.siteName} | %s`,
  default: METADATA.siteName,
};

const DESCRIPTION = METADATA.description;

export async function generateMetadata(): Promise<Metadata> {
  const canonical = await getCanonicalUrl();
  const robots = await getRobots("index, follow");
  const metadataBase = new URL(canonical);

  return {
    metadataBase,
    applicationName: METADATA.siteName,
    title: TITLE,
    description: DESCRIPTION,
    keywords: METADATA.keywords,
    robots,
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    alternates: {
      canonical,
      languages: {
        "x-default": canonical,
      },
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      images: [
        {
          url: METADATA.imageUrl,
          secureUrl: METADATA.imageUrl,
          alt: METADATA.imageAlt,
          type: METADATA.imageType,
          width: 1200,
          height: 630,
        },
      ],
      url: canonical,
      siteName: METADATA.siteName,
      locale: METADATA.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [METADATA.imageUrl],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: METADATA.themeColor,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [deviceInfo, version] = await Promise.all([getServerDeviceInfo(), getPackageVersion()]);

  const initData = {
    deviceInfo,
    googleClientId: SERVER_ENV.GOOGLE_CLIENT_ID,
    version,
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pretendard.variable}`}
    >
      <body className="font-sans antialiased">
        <Provider initData={initData}>{children}</Provider>
      </body>
    </html>
  );
}
