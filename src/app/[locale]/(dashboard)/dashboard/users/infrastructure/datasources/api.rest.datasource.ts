import { IResponseMessage } from '@/core';
import { httpClient } from '@/core/network';
import { UserRepository } from '../../domain/repositories/user.repository';
import { IUser, IUserCreate, IUserResponse, IUserUpdate } from '../../domain/interfaces';
import { UserCreateDto, UserDto, UserResponseDto, UserUpdateDto } from '../dtos';
import { UserMapper } from '../mappers/user.mapper';

export class ApiRestDataSource implements UserRepository {
  constructor() {}

  async getUsers(page: number, limit: number): Promise<IUserResponse> {
    try {
      console.log(`Solicitando página ${page}, límite ${limit}`);

      const response = await httpClient.get<UserResponseDto>(`/users/${limit}/${page}`);
      return UserMapper.toUserResponseDomain(response.data, page, limit);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser> {
    try {
      const response = await httpClient.get<UserDto>(`/users/${id}`);
      return UserMapper.toDomain(response.data);
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }

  async createUser(user: IUserCreate): Promise<IResponseMessage> {
    try {
      const userDto = UserMapper.toCreateDto(user);
      const response = await httpClient.post<UserCreateDto, IResponseMessage>('/users', userDto);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, user: IUserUpdate): Promise<IResponseMessage> {
    try {
      const userDto = UserMapper.toUpdateDto(user);
      const response = await httpClient.put<UserUpdateDto, IResponseMessage>(`/users/${id}`, userDto);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<IResponseMessage> {
    try {
      const response = await httpClient.delete<IResponseMessage>(`/users/${id}/soft`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  async activateUser(id: string): Promise<IResponseMessage> {
    try {
      const response = await httpClient.patch<object, IResponseMessage>(`/users/${id}/activate`, {});
      return response.data;
    } catch (error) {
      console.error(`Error activating user with id ${id}:`, error);
      throw error;
    }
  }

  async deactivateUser(id: string): Promise<IResponseMessage> {
    try {
      const response = await httpClient.patch<object, IResponseMessage>(`/users/${id}/deactivate`, {});
      return response.data;
    } catch (error) {
      console.error(`Error deactivating user with id ${id}:`, error);
      throw error;
    }
  }
}
