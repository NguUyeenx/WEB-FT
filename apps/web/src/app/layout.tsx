import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShoeParadise - Premium Footwear Store',
  description:
    'Discover the latest styles in athletic and casual footwear. Shop Nike, Adidas, New Balance and more.',
  keywords: ['shoes', 'sneakers', 'footwear', 'nike', 'adidas', 'new balance'],
  openGraph: {
    title: 'ShoeParadise - Premium Footwear Store',
    description:
      'Discover the latest styles in athletic and casual footwear.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t py-8 mt-16">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>&copy; 2024 ShoeParadise. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
