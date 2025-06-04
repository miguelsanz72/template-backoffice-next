import { EUserRole } from '../enums';

export interface IUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  isActive: boolean;
  emailVerified: boolean;
  organization: null;
  userRoles: EUserRole[];
  avatar: {
    url: string | null;
    charter: string;
    color: string;
  };
}

export interface IUserCreate {
  name: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
}

export interface IUserUpdate {
  name: string;
  lastName: string;
  email: string;
  password?: string;
  isActive: boolean;
  role: string;
}

export interface IUserResponse {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
}
