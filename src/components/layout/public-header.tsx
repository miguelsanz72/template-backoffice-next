import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

export const PublicHeader: React.FC = () => {
  const t = useTranslations('Footer');
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          {t('brand')}
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-gray-700 hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-gray-700 hover:text-primary">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-gray-700 hover:text-primary">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/login" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
