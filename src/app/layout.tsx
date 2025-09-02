
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Space_Grotesk } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Crevings Restaurant Hub',
  description: 'The complete restaurant management backend for Crevings.',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
