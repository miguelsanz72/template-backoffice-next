'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { IUser } from '../../domain';
import { useUsersStore } from '../store';
import { UserDeleteDialog } from './user-delete-dialog';
import { UserFormSheet } from './user-form-sheet';


interface UsersTableProps {
  users: IUser[];
}

export function UsersTable({ users }: UsersTableProps) {
  const t = useTranslations('Users');
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const { deleteUser, activateUser, deactivateUser } = useUsersStore();

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleActivateDeactivate = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateUser(id);
      } else {
        await activateUser(id);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <>
      <Table>
        <TableCaption>{t('table.caption')}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.headers.name')}</TableHead>
            <TableHead>{t('table.headers.email')}</TableHead>
            <TableHead>{t('table.headers.role')}</TableHead>
            <TableHead>{t('table.headers.status')}</TableHead>
            <TableHead className="text-right">{t('table.headers.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {t('table.no_users')}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userRoles.join(', ')}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {user.isActive ? t('status.active') : t('status.inactive')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleActivateDeactivate(user.id, user.isActive)}
                      title={user.isActive ? t('actions.deactivate') : t('actions.activate')}
                    >
                      {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setUserToEdit(user);
                        setIsEditSheetOpen(true);
                      }}
                      title={t('actions.edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteDialogOpen(true);
                      }}
                      title={t('actions.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {userToDelete && (
        <UserDeleteDialog
          user={userToDelete}
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
          }}
          onConfirm={() => handleDelete(userToDelete.id)}
        />
      )}

      <UserFormSheet
        user={userToEdit}
        isOpen={isEditSheetOpen}
        onClose={() => {
          setIsEditSheetOpen(false);
          setUserToEdit(null);
        }}
      />
    </>
  );
}