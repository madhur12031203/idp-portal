import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import "./blueprint.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const image = new URL("/og-dark.png", `${protocol}://${host}`).toString();

  return {
    title: "IDP Portal - Government Development Planning",
    description: "Official employee development planning, review, and HR administration workspace.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "IDP Portal - Government Development Planning",
      description: "Manage official employee development records, reviews, and approvals.",
      type: "website",
      images: [{ url: image, width: 1731, height: 909, alt: "Government IDP portal" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "IDP Portal - Government Development Planning",
      description: "Manage official employee development records, reviews, and approvals.",
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
