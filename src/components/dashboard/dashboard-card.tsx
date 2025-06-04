import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

/**
 * Dashboard card component for displaying metrics and information
 * @param title Title of the card
 * @param value Main value to display
 * @param description Optional description text
 * @param icon Optional icon component
 * @param className Optional additional CSS classes
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, icon: Icon, className }) => {
  return (
    <Card
      className={cn(
        'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow transition-all duration-200',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</CardTitle>
          {Icon && (
            <div className="text-blue-500 dark:text-blue-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
        {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </CardContent>
    </Card>
  );
};
