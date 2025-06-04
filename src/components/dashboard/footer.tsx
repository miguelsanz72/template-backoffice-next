import React from 'react';
import Link from 'next/link';
import { Github, Mail, Heart } from 'lucide-react';

export const DashboardFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200/30 dark:border-slate-700/30 rounded-b-2xl">
      <div className="flex flex-col items-center justify-between gap-4 py-3 md:h-12 md:flex-row md:px-6">
        <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2 md:items-center text-center text-sm text-slate-500 dark:text-slate-400 md:text-left">
          <div className="flex items-center gap-1">
            <span>&copy; {currentYear}</span>
            <span className="font-medium">TuFirma Digital</span>
          </div>
          <span className="hidden md:inline text-slate-300/40 dark:text-slate-600/40">•</span>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>en Chile</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex items-center space-x-4 text-xs font-medium">
            <Link
              href="/dashboard/terms"
              className="text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              Términos
            </Link>
            <Link
              href="/dashboard/privacy"
              className="text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              Privacidad
            </Link>
            <Link
              href="/dashboard/help"
              className="text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              Ayuda
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Link
              href="https://github.com/tufirma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="mailto:contacto@tufirma.cl"
              className="text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
