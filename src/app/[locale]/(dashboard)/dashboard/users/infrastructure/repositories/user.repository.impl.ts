import { IResponseMessage } from '@/core';
import { UserRepository } from '../../domain/repositories/user.repository';
import { IUser, IUserCreate, IUserResponse, IUserUpdate } from '../../domain/interfaces';
import { ApiRestDataSource } from '../datasources/api.rest.datasource';

/**
 * Implementación del repositorio de usuarios
 * Responsable de la comunicación con la API
 */
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly dataSource: ApiRestDataSource) {}

  /**
   * Obtiene la lista de usuarios paginada
   * @param page Número de página
   * @param limit Límite de registros por página
   * @returns Respuesta con usuarios y metadatos de paginación
   */
  async getUsers(page: number, limit: number): Promise<IUserResponse> {
    try {
      return await this.dataSource.getUsers(page, limit);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @returns Datos del usuario
   */
  async getUserById(id: string): Promise<IUser> {
    try {
      return await this.dataSource.getUserById(id);
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   * @param user Datos del usuario a crear
   * @returns Mensaje de respuesta
   */
  async createUser(user: IUserCreate): Promise<IResponseMessage> {
    try {
      return await this.dataSource.createUser(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   * @param id ID del usuario
   * @param user Datos actualizados del usuario
   * @returns Mensaje de respuesta
   */
  async updateUser(id: string, user: IUserUpdate): Promise<IResponseMessage> {
    try {
      return await this.dataSource.updateUser(id, user);
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un usuario
   * @param id ID del usuario a eliminar
   * @returns Mensaje de respuesta
   */
  async deleteUser(id: string): Promise<IResponseMessage> {
    try {
      return await this.dataSource.deleteUser(id);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activa un usuario
   * @param id ID del usuario a activar
   * @returns Mensaje de respuesta
   */
  async activateUser(id: string): Promise<IResponseMessage> {
    try {
      return await this.dataSource.activateUser(id);
    } catch (error) {
      console.error(`Error activating user with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Desactiva un usuario
   * @param id ID del usuario a desactivar
   * @returns Mensaje de respuesta
   */
  async deactivateUser(id: string): Promise<IResponseMessage> {
    try {
      return await this.dataSource.deactivateUser(id);
    } catch (error) {
      console.error(`Error deactivating user with id ${id}:`, error);
      throw error;
    }
  }
}