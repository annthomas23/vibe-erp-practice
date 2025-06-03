import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vibe ERP',
  description: 'Practice ERP System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-xl font-bold text-gray-800">
                      Vibe ERP
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link href="/products" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700">
                      Products
                    </Link>
                    <Link href="/purchases" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700">
                      Purchase History
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
