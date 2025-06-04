'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUsersStore } from './store';
import { UsersTable } from './components/users-table';
import { UserFormSheet } from './components/user-form-sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginationComponent } from '@/components/dashboard/pagination';

export default function UsersPage() {
  const t = useTranslations('Users');

  // Estado local para el formulario
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Obtener estado y acciones del store
  const { users, total, page, limit, isLoading, getUsers } = useUsersStore();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    getUsers(page, limit);
  }, [page, limit, getUsers]);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(total / limit);

  // Cambiar de página
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      getUsers(newPage, limit);
    }
  };

  // Abrir formulario para crear usuario
  const handleOpenCreateForm = () => {
    setIsFormOpen(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button onClick={handleOpenCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          {t('actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('card.title')}</CardTitle>
          <CardDescription>{t('card.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <UsersTable users={users} />

              <PaginationComponent currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Formulario para crear usuario */}
      <UserFormSheet user={null} isOpen={isFormOpen} onClose={handleCloseForm} />
    </div>
  );
}
