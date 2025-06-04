'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import type { ReactNode } from 'react';
import { useIsMobile } from '@/core/hooks/use-mobile';

interface DndProviderWrapperProps {
  children: ReactNode;
}

export const DndProviderWrapper = ({ children }: DndProviderWrapperProps) => {
  const isMobile = useIsMobile();

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={isMobile ? { enableMouseEvents: true } : undefined}>
      {children}
    </DndProvider>
  );
};
