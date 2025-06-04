/**
 * DTOs para el módulo de usuarios
 * Estos objetos se utilizan para la comunicación con el API
 */

export interface UserDto {
  id: string;
  email: string;
  username: string;
  display_name: string;
  is_active: boolean;
  organization?: null;
  roles: string[];
  avatar: {
    url: string | null;
    charter: string;
    color: string;
  };
}

export interface UserCreateDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_active: boolean;
  role: string;
}

export interface UserUpdateDto {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  is_active: boolean;
  role: string;
}

export interface UserResponseDto {
  data: UserDto[];
  page: number;
  per_page: number;
  total_count: number;
}
