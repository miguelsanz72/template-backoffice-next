'use client';

import { useTranslations } from 'next-intl';

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { IUser } from '../../domain';

interface UserDeleteDialogProps {
  user: IUser;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UserDeleteDialog({ user, isOpen, onClose, onConfirm }: UserDeleteDialogProps) {
  const t = useTranslations('Users');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="sm:max-w-md sm:h-auto sm:mx-auto sm:p-4">
        <SheetHeader>
          <SheetTitle>{t('delete_dialog.title')}</SheetTitle>
          <SheetDescription>{t('delete_dialog.description', { name: user.displayName })}</SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('delete_dialog.warning')}</p>
        </div>
        <SheetFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t('actions.delete')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
