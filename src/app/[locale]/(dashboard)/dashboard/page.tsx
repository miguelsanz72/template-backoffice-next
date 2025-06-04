import React from 'react';
import { Users, FileText, FileSignature, Clock, CheckCircle, BarChart3 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCard } from '@/components/dashboard/dashboard-card';

export default function DashboardPage() {
  const statsCards = [
    {
      title: 'Total de Usuarios',
      value: '24',
      icon: Users,
      description: 'Usuarios activos en la plataforma',
    },
    {
      title: 'Documentos Activos',
      value: '12',
      icon: FileText,
      description: 'Documentos en proceso de firma',
    },
    {
      title: 'Firmas Completadas',
      value: '85',
      icon: FileSignature,
      description: 'Firmas realizadas este mes',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Panel de Control</h1>
        <p className="text-slate-500 dark:text-slate-400">Bienvenido a tu panel de control de TuFirma Digital.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((card) => (
          <DashboardCard key={card.title} title={card.title} value={card.value} icon={card.icon} description={card.description} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium text-slate-900 dark:text-white">Documentos Recientes</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
                  Los últimos documentos que requieren tu atención
                </CardDescription>
              </div>
              <div className="text-blue-500 dark:text-blue-400">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Contrato de Servicios', status: 'Pendiente', icon: Clock, time: '2 horas' },
                { name: 'Acuerdo de Confidencialidad', status: 'Pendiente', icon: Clock, time: '1 día' },
                { name: 'Autorización de Pago', status: 'Completado', icon: CheckCircle, time: '3 horas' },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`${
                        doc.status === 'Completado' ? 'text-green-500 dark:text-green-400' : 'text-amber-500 dark:text-amber-400'
                      }`}
                    >
                      <doc.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{doc.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Actualizado hace {doc.time}</p>
                    </div>
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      doc.status === 'Completado'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    {doc.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium text-slate-900 dark:text-white">Rendimiento del Equipo</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
                  Progreso de actividades por departamento
                </CardDescription>
              </div>
              <div className="text-purple-500 dark:text-purple-400">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { name: 'Equipo Legal', progress: 75, color: 'bg-green-500 dark:bg-green-400' },
                { name: 'Equipo de Desarrollo', progress: 90, color: 'bg-blue-500 dark:bg-blue-400' },
                { name: 'Equipo de Marketing', progress: 60, color: 'bg-purple-500 dark:bg-purple-400' },
              ].map((team) => (
                <div key={team.name}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{team.name}</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{team.progress}%</p>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className={`${team.color} h-2 rounded-full`} style={{ width: `${team.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
