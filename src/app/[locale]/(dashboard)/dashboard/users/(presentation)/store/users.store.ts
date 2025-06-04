'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UsersStore } from './users.types';
import { ApiRestDataSource, UserRepositoryImpl } from '../../infrastructure';
import { IUser } from '../../domain';

// Inicializar el repositorio con la fuente de datos
const apiRestDataSource = new ApiRestDataSource();
const usersRepository = new UserRepositoryImpl(apiRestDataSource);

/**
 * Store de usuarios
 * Gestiona el estado global de los usuarios y proporciona acciones para interactuar con el repositorio
 */
export const useUsersStore = create<UsersStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        users: [],
        selectedUser: null,
        total: 0,
        page: 0,
        limit: 50,
        isLoading: false,
        errorMessage: null,
        successMessage: null,

        getUsers: async (page = 0, limit = 50) => {
          try {
            set({ isLoading: true, errorMessage: null });

            const response = await usersRepository.getUsers(page, limit);

            set({
              users: response.users,
              total: response.total,
              page: response.page,
              limit: response.limit,
              isLoading: false,
            });
          } catch (error) {
            console.error('Error fetching users:', error);
            set({
              isLoading: false,
              errorMessage: 'Error al cargar los usuarios. Por favor, inténtelo de nuevo.',
            });
          }
        },

        getUserById: async (id: string) => {
          try {
            set({ isLoading: true, errorMessage: null });

            const user = await usersRepository.getUserById(id);
            set({ isLoading: false });

            return user;
          } catch (error) {
            console.error(`Error fetching user with id ${id}:`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al cargar el usuario. Por favor, inténtelo de nuevo.',
            });
            return null;
          }
        },

        createUser: async (user) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await usersRepository.createUser(user);

            // Recargar la lista de usuarios después de crear uno nuevo
            const { page, limit } = get();
            await get().getUsers(page, limit);

            set({
              isLoading: false,
              successMessage: 'Usuario creado correctamente',
            });
          } catch (error) {
            console.error('Error creating user:', error);
            set({
              isLoading: false,
              errorMessage: 'Error al crear el usuario. Por favor, inténtelo de nuevo.',
            });
          }
        },

        updateUser: async (id, user) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            console.log(user);

            await usersRepository.updateUser(id, user);

            // Recargar la lista de usuarios después de actualizar
            const { page, limit } = get();
            await get().getUsers(page, limit);

            set({
              isLoading: false,
              successMessage: 'Usuario actualizado correctamente',
            });
          } catch (error) {
            console.error(`Error updating user with id ${id}:`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al actualizar el usuario. Por favor, inténtelo de nuevo.',
            });
          }
        },

        deleteUser: async (id) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await usersRepository.deleteUser(id);

            // Recargar la lista de usuarios después de eliminar
            const { page, limit } = get();
            await get().getUsers(page, limit);

            set({
              isLoading: false,
              successMessage: 'Usuario eliminado correctamente',
            });
          } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al eliminar el usuario. Por favor, inténtelo de nuevo.',
            });
          }
        },

        /**
         * Activa un usuario
         * @param id ID del usuario a activar
         */
        activateUser: async (id) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await usersRepository.activateUser(id);

            // Actualizar el estado del usuario en la lista local
            const { users } = get();
            const updatedUsers = users.map((user) => (user.id === id ? { ...user, isActive: true } : user));

            set({
              users: updatedUsers,
              isLoading: false,
              successMessage: 'Usuario activado correctamente',
            });
          } catch (error) {
            console.error(`Error activating user with id ${id}:`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al activar el usuario. Por favor, inténtelo de nuevo.',
            });
          }
        },

        /**
         * Desactiva un usuario
         * @param id ID del usuario a desactivar
         */
        deactivateUser: async (id) => {
          try {
            set({ isLoading: true, errorMessage: null, successMessage: null });

            await usersRepository.deactivateUser(id);

            // Actualizar el estado del usuario en la lista local
            const { users } = get();
            const updatedUsers = users.map((user) => (user.id === id ? { ...user, isActive: false } : user));

            set({
              users: updatedUsers,
              isLoading: false,
              successMessage: 'Usuario desactivado correctamente',
            });
          } catch (error) {
            console.error(`Error deactivating user with id ${id}:`, error);
            set({
              isLoading: false,
              errorMessage: 'Error al desactivar el usuario. Por favor, inténtelo de nuevo.',
            });
          }
        },

        /**
         * Establece el usuario seleccionado
         * @param user Usuario seleccionado o null para deseleccionar
         */
        setSelectedUser: (user: IUser | null) => {
          set({ selectedUser: user });
        },

        /**
         * Limpia los mensajes de error y éxito
         */
        clearMessages: () => {
          set({ errorMessage: null, successMessage: null });
        },
      }),
      {
        name: 'users-storage',
        partialize: (state) => ({
          // Solo persistir estos campos
          page: state.page,
          limit: state.limit,
        }),
      }
    )
  )
);
