'use client';

import React, { useEffect } from 'react';

import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardFooter } from '@/components/dashboard/footer';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const authStatus = useAuthStore((state) => state.status);
  const router = useRouter();

  // Navigate from an effect: calling router.push during render triggers a React setState-in-render error
  useEffect(() => {
    if (authStatus === 'not-authenticated') {
      router.replace('/auth/login');
    }
  }, [authStatus, router]);

  if (authStatus === 'checking') {
    //TODO: Implementar un loader/spinner
    return <div>Cargando...</div>;
  }

  if (authStatus === 'not-authenticated') {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full bg-slate-900 dark:bg-slate-950 flex items-center justify-center p-0 md:pr-4">
        <div className="w-full h-screen md:h-[calc(100vh-2rem)] md:rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <AppSidebar />
          <div className="flex-1 bg-white dark:bg-slate-800 overflow-hidden flex flex-col md:rounded-2xl">
            <DashboardHeader />
            <main className="flex-1 overflow-auto p-4 md:p-6 ">
              <div className="mx-auto w-full max-w-screen-3xl">{children}</div>
            </main>
            <DashboardFooter />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
