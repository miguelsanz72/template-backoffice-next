import Link from 'next/link';
import React from 'react';
import { Search, Bell, User, Settings, LogOut, MenuIcon, PanelLeft, PanelRight } from 'lucide-react';
import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useSidebar } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const DashboardHeader: React.FC = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { isMobile, toggleSidebar, openMobile, setOpenMobile, state } = useSidebar();
  // Variable para controlar si el sidebar está colapsado o no
  const isCollapsed = state === 'collapsed';

  const handleSidebarToggle = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      toggleSidebar();
    }
  };

  const logout = () => {
    useAuthStore.getState().logout();
    // The logout route also clears the session cookies on the server (see src/proxy.ts)
    router.push('/auth/logout');
  };

  // Obtener las iniciales del usuario para el avatar
  const getUserInitials = () => {
    if (!user || !user.displayName) return 'U';

    const nameParts = user.displayName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200/30 dark:border-slate-700/30 md:rounded-t-2xl overflow-hidden">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 h-8 w-8 border border-slate-200/30 dark:border-slate-700/30 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            aria-label={isMobile ? (openMobile ? 'Cerrar menú' : 'Abrir menú') : isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            onClick={handleSidebarToggle}
          >
            {isMobile ? (
              openMobile ? (
                <PanelRight className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )
            ) : isCollapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelRight className="h-5 w-5" />
            )}
          </Button>
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />

              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full rounded-md border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 pl-10 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
              3
            </span>
            <span className="sr-only">Notificaciones</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                <Avatar className="h-10 w-10 border-2 border-slate-200/50 dark:border-slate-700/50">
                  <AvatarImage src={user?.avatar?.url || ''} alt={user?.displayName || 'Usuario'} />
                  <AvatarFallback className="text-base font-semibold bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{user?.displayName}</p>
                  <p className="text-xs leading-none text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/dashboard/profile" className="flex w-full items-center gap-2 text-slate-700 dark:text-slate-300">
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/settings" className="flex w-full items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Settings className="h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
              <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-500 focus:text-red-500">
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
