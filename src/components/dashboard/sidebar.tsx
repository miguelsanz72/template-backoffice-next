import { Users, Settings, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { SmartLogo } from '../ui/smart-logo';

// Elementos del menú
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Usuarios',
    url: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Configuración',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;

  // En el caso de mobile, queremos un fondo sólido
  const mobileStyles = isMobile ? 'bg-slate-900 dark:bg-slate-950 w-full h-full' : '';

  return (
    <Sidebar
      className={cn(
        'h-full lg:h-auto border-0 border-transparent flex-shrink-0 transition-all duration-300',
        'bg-slate-900 dark:bg-slate-950', // Aseguramos fondo sólido siempre
        isCollapsed ? 'lg:w-[64px]' : 'lg:w-[240px]',
        mobileStyles
      )}
      collapsible="icon"
      data-mobile={isMobile ? 'true' : 'false'}
    >
      <SidebarContent className="flex flex-col h-full pt-4 pb-6">
        <div className={cn('flex items-center mb-6', isMobile ? 'px-6 py-4 justify-start' : 'px-4 py-2 justify-center')}>
          <Link href="/dashboard" className={cn('flex items-center', isMobile ? 'justify-start' : 'justify-center')}>
            {isCollapsed ? <SmartLogo withText={false} width={32} height={32} /> : <SmartLogo withText={true} width={120} height={40} />}
          </Link>
        </div>
        <SidebarGroup className="flex-1">
          {(!isCollapsed || isMobile) && (
            <SidebarGroupLabel
              className={cn(
                'py-2 text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wider',
                isMobile ? 'px-6' : 'px-4'
              )}
            >
              Menú Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn('py-1', isCollapsed ? 'flex justify-center px-0' : 'px-2', isMobile && 'px-4')}
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={isCollapsed && !isMobile ? item.title : undefined}
                      className={isCollapsed && !isMobile ? 'mx-auto w-auto' : ''}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          'flex items-center text-sm font-medium transition-colors duration-200',
                          isActive
                            ? 'bg-slate-800/80 dark:bg-slate-800/80 text-white'
                            : 'text-slate-300 dark:text-slate-300 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 hover:text-white',
                          isCollapsed && !isMobile ? 'justify-center w-10 h-10 p-0 rounded-md' : 'gap-3 px-3 py-2 rounded-md',
                          isMobile && 'py-3'
                        )}
                      >
                        <item.icon
                          className={cn(isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400', isMobile ? 'h-6 w-6' : 'h-5 w-5')}
                        />
                        {(!isCollapsed || isMobile) && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isMobile && (
          <div className="mt-auto px-6 pt-4 pb-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-700/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span>© 2025 TuFirma Digital</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span>Hecho con ❤️ en Chile</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
