
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import AuthGuard from "@/components/auth/AuthGuard"
import { DM_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Crevings Restaurant Hub',
  description: 'The complete restaurant management backend for Crevings.',
};

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
})

const dmSansHeading = DM_Sans({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-heading',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${dmSans.variable} ${dmSansHeading.variable} font-sans safe-area-padding`}>
        <AuthGuard />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
