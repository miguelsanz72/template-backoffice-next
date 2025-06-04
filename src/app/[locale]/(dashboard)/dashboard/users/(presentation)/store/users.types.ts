import { IUser, IUserCreate, IUserUpdate } from '../../domain';

/**
 * Estado del store de usuarios
 */
export interface UsersState {
  users: IUser[];
  selectedUser: IUser | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

/**
 * Acciones disponibles en el store de usuarios
 */
export interface UsersActions {
  // Acciones de consulta
  getUsers: (page?: number, limit?: number) => Promise<void>;
  getUserById: (id: string) => Promise<IUser | null>;
  
  // Acciones de mutación
  createUser: (user: IUserCreate) => Promise<void>;
  updateUser: (id: string, user: IUserUpdate) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
  
  // Acciones de UI
  setSelectedUser: (user: IUser | null) => void;
  clearMessages: () => void;
}

/**
 * Tipo completo del store de usuarios
 */
export type UsersStore = UsersState & UsersActions;