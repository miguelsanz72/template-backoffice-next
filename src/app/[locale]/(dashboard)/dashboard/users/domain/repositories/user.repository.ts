import { IResponseMessage } from '@/core';
import { IUser, IUserCreate, IUserResponse, IUserUpdate } from '../interfaces';

export abstract class UserRepository {
  abstract getUsers(page: number, limit: number): Promise<IUserResponse>;
  abstract getUserById(id: string): Promise<IUser>;
  abstract createUser(user: IUserCreate): Promise<IResponseMessage>;
  abstract updateUser(id: string, user: IUserUpdate): Promise<IResponseMessage>;
  abstract deleteUser(id: string): Promise<IResponseMessage>;
  abstract activateUser(id: string): Promise<IResponseMessage>;
  abstract deactivateUser(id: string): Promise<IResponseMessage>;
}