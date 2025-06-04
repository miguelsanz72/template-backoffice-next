import { IResponseMessage } from '@/core';
import { IUser, IUserCreate, IUserResponse, IUserUpdate } from '../../domain/interfaces';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { ApiRestDataSource } from '../datasources/api.rest.datasource';

/**
 * Servicio que maneja las operaciones de usuarios
 * Actúa como una fachada para la implementación del repositorio
 */
export class UserService {
  private static repository = new UserRepositoryImpl(new ApiRestDataSource());

  /**
   * Obtiene la lista de usuarios paginada
   * @param page Número de página
   * @param limit Límite de registros por página
   * @returns Promesa con la respuesta de usuarios
   */
  static async getUsers(page: number, limit: number): Promise<IUserResponse> {
    try {
      return await this.repository.getUsers(page, limit);
    } catch (error) {
      console.error('Error in UserService.getUsers:', error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @returns Promesa con los datos del usuario
   */
  static async getUserById(id: string): Promise<IUser> {
    try {
      return await this.repository.getUserById(id);
    } catch (error) {
      console.error(`Error in UserService.getUserById for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Promesa con el mensaje de respuesta
   */
  static async createUser(userData: IUserCreate): Promise<IResponseMessage> {
    try {
      return await this.repository.createUser(userData);
    } catch (error) {
      console.error('Error in UserService.createUser:', error);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   * @param id ID del usuario
   * @param userData Datos actualizados del usuario
   * @returns Promesa con el mensaje de respuesta
   */
  static async updateUser(id: string, userData: IUserUpdate): Promise<IResponseMessage> {
    try {
      return await this.repository.updateUser(id, userData);
    } catch (error) {
      console.error(`Error in UserService.updateUser for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un usuario
   * @param id ID del usuario a eliminar
   * @returns Promesa con el mensaje de respuesta
   */
  static async deleteUser(id: string): Promise<IResponseMessage> {
    try {
      return await this.repository.deleteUser(id);
    } catch (error) {
      console.error(`Error in UserService.deleteUser for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activa un usuario
   * @param id ID del usuario a activar
   * @returns Promesa con el mensaje de respuesta
   */
  static async activateUser(id: string): Promise<IResponseMessage> {
    try {
      return await this.repository.activateUser(id);
    } catch (error) {
      console.error(`Error in UserService.activateUser for id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Desactiva un usuario
   * @param id ID del usuario a desactivar
   * @returns Promesa con el mensaje de respuesta
   */
  static async deactivateUser(id: string): Promise<IResponseMessage> {
    try {
      return await this.repository.deactivateUser(id);
    } catch (error) {
      console.error(`Error in UserService.deactivateUser for id ${id}:`, error);
      throw error;
    }
  }
}