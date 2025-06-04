'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Sheet, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { userFormSchema, UserFormValues } from '../../domain/validations/user-schema';
import { IUser, IUserCreate, IUserUpdate } from '../../domain/interfaces';
import { useUsersStore } from '../store';
import { EUserRole } from '../../domain/enums';
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserFormSheetProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
}

// Componente personalizado de SheetContent para pantalla completa
const SheetContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content>) => {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          "w-full h-full max-w-full border-none",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-muted p-2 hover:bg-muted/80">
          <XIcon className="h-6 w-6" />
          <span className="sr-only">Cerrar</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
};

export function UserFormSheet({ user, isOpen, onClose }: UserFormSheetProps) {
  const t = useTranslations('Users');
  const { createUser, updateUser } = useUsersStore();
  const isEditing = !!user;

  const validationSchema = userFormSchema({
    name: {
      required: t('validation.name_required'),
    },
    email: {
      required: t('validation.email_required'),
      invalid: t('validation.email_invalid'),
    },
    password: isEditing
      ? {}
      : {
          required: t('validation.password_required'),
          minLength: t('validation.password_min_length'),
          maxLength: t('validation.password_max_length'),
        },
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      isActive: true,
      role: 'user',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (user) {
      // Extraer nombre y apellido del displayName
      const nameParts = user.displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      form.reset({
        name: firstName,
        lastName: lastName,
        email: user.email,
        password: '',
        isActive: user.isActive,
        role: user.userRoles[0] || EUserRole.USER,
      });
    } else {
      form.reset({
        name: '',
        lastName: '',
        email: '',
        password: '',
        isActive: true,
        role: EUserRole.USER,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isEditing && user) {
        const updateData: IUserUpdate = {
          name: data.name,
          lastName: data.lastName || '',
          email: data.email,
          isActive: data.isActive,
          role: data.role,
        };

        if (data.password) {
          updateData.password = data.password;
        }

        await updateUser(user.id, updateData);
      } else {
        const createData: IUserCreate = {
          name: data.name,
          lastName: data.lastName || '',
          email: data.email,
          password: data.password || '',
          isActive: data.isActive,
          role: data.role,
        };

        await createUser(createData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <div className="h-full w-full p-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isEditing ? t('form.edit_title') : t('form.create_title')}</SheetTitle>
            <SheetDescription>{isEditing ? t('form.edit_description') : t('form.create_description')}</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.fields.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.placeholders.name')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.fields.lastName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.placeholders.lastName')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.fields.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('form.placeholders.email')} {...field} disabled={isEditing} />
                    </FormControl>
                    {isEditing && <FormDescription>{t('form.email_edit_note')}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEditing ? t('form.fields.password_optional') : t('form.fields.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('form.placeholders.password')} {...field} />
                    </FormControl>
                    {isEditing && <FormDescription>{t('form.password_edit_note')}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.fields.role')}</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value={EUserRole.USER}>{t('roles.user')}</option>
                        <option value={EUserRole.ADMIN}>{t('roles.admin')}</option>
                        <option value={EUserRole.CLIENT}>{t('roles.client')}</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t('form.fields.isActive')}</FormLabel>
                      <FormDescription>{t('form.isActive_description')}</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <SheetFooter className="pt-4">
                <Button variant="outline" onClick={onClose} type="button">
                  {t('actions.cancel')}
                </Button>
                <Button type="submit">{isEditing ? t('actions.update') : t('actions.create')}</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
