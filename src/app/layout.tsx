
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import AuthGuard from "@/components/auth/AuthGuard"
import { Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Crevings Restaurant Hub',
  description: 'The complete restaurant management backend for Crevings.',
};

const poppinsSans = Poppins({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  variable: '--font-sans',
})

const poppinsHeading = Poppins({
  subsets: ['latin'],
  weight: ['600','700'],
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
      <body className={`${poppinsSans.variable} ${poppinsHeading.variable} font-sans safe-area-padding`}>
        <AuthGuard />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
