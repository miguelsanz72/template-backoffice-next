import { IUserLogin, ILoginResponse, IUserRegister } from '../../domain/interfaces';
import { IResponseMessage } from '@/core';
import { AuthRepositoryImpl } from '../repositories/auth.repository.impl';
import { ApiRestDataSource } from '../datasources/api.rest.datasource';

/**
 * Service that handles authentication operations
 * Acts as a facade for the repository implementation
 */
export class AuthService {
  private static repository = new AuthRepositoryImpl(new ApiRestDataSource());

  /**
   * Authenticates a user with email and password
   * @param email User email
   * @param password User password
   * @returns Promise with login response
   */
  static async login(email: string, password: string): Promise<ILoginResponse> {
    try {
      const loginData: IUserLogin = { email, password };
      return await this.repository.login(loginData);
    } catch (error) {
      console.error('Error in AuthService.login:', error);
      throw error;
    }
  }

  /**
   * Registers a new user
   * @param userData User registration data
   * @returns Promise with registration response
   */
  static async register(userData: IUserRegister): Promise<IResponseMessage> {
    try {
      return await this.repository.register(userData);
    } catch (error) {
      console.error('Error in AuthService.register:', error);
      throw error;
    }
  }
}
