import { IUser, IUserCreate, IUserResponse, IUserUpdate } from '../../domain/interfaces';
import { UserCreateDto, UserDto, UserResponseDto, UserUpdateDto } from '../dtos';
import { EUserRole } from '../../domain/enums';

/**
 * UserMapper
 * Responsable de transformar modelos de dominio a DTOs y viceversa
 */
export class UserMapper {
  /**
   * Convierte un DTO de usuario a un modelo de dominio
   * @param userDto DTO del usuario desde la API
   * @returns Modelo de dominio del usuario
   */
  static toDomain(userDto: UserDto): IUser {
    return {
      id: userDto.id,
      email: userDto.email,
      username: userDto.username,
      displayName: userDto.display_name,
      isActive: userDto.is_active,
      emailVerified: true,
      organization: null,
      userRoles: userDto.roles as EUserRole[],
      avatar: userDto.avatar,
    };
  }

  /**
   * Convierte una respuesta DTO de usuarios a un modelo de dominio
   * @param responseDto DTO de respuesta desde la API
   * @param requestedPage Página solicitada originalmente
   * @param requestedLimit Límite solicitado originalmente
   * @returns Modelo de dominio de respuesta de usuarios
   */
  static toUserResponseDomain(responseDto: UserResponseDto, requestedPage?: number, requestedLimit?: number): IUserResponse {
    return {
      users: responseDto.data.map(this.toDomain),
      total: responseDto.total_count,
      page: requestedPage !== undefined ? requestedPage : responseDto.page,
      limit: requestedLimit !== undefined ? requestedLimit : responseDto.per_page,
    };
  }

  /**
   * Convierte un modelo de dominio de creación de usuario a un DTO
   * @param user Modelo de dominio para crear usuario
   * @returns DTO formateado para la API
   */
  static toCreateDto(user: IUserCreate): UserCreateDto {
    return {
      first_name: user.name,
      last_name: user.lastName,
      email: user.email,
      password: user.password,
      is_active: user.isActive,
      role: user.role,
    };
  }

  /**
   * Convierte un modelo de dominio de actualización de usuario a un DTO
   * @param user Modelo de dominio para actualizar usuario
   * @returns DTO formateado para la API
   */
  static toUpdateDto(user: IUserUpdate): UserUpdateDto {
    const updateDto: UserUpdateDto = {
      first_name: user.name,
      last_name: user.lastName,
      email: user.email,
      is_active: user.isActive,
      role: user.role,
    };

    if (user.password) {
      updateDto.password = user.password;
    }

    return updateDto;
  }
}
