import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CreatorLedger - Influencer Revenue Management SaaS",
    description: "The ultimate revenue management platform for content creators. Track earnings, manage brand deals, and get AI-powered insights all in one place.",
    keywords: "creator economy, influencer management, revenue tracking, brand deals, content creator tools",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">{children}</body>
        </html>
    );
}
