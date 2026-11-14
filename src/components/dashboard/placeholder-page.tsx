import React from 'react';
import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Icon className="h-5 w-5 text-blue-500" />
          <div>
            <CardTitle>Contenido en preparación</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-slate-500 dark:text-slate-400">
          Reemplaza este texto con el contenido definitivo de la página.
        </CardContent>
      </Card>
    </div>
  );
}
