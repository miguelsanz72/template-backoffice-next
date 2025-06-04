import { ILoginResponse, IUserRegister } from '../../domain/interfaces';
import { RegisterRequestDto } from '../dtos';
import { ILoginResponseDto } from '../dtos/login.dto';

/**
 * AuthMapper
 * Responsible for transforming domain models to DTOs and vice versa
 */
export class AuthMapper {
  /**
   * Maps a domain user registration model to the API DTO format
   * @param user Domain user registration model
   * @returns DTO formatted for the API
   */
  static toRegisterDto(user: IUserRegister): RegisterRequestDto {
    return {
      first_name: user.name,
      last_name: user.lastName,
      email: user.email,
      password: user.password,
    };
  }

  static toLoginResponseDto(user: ILoginResponseDto): ILoginResponse {
    return {
      user: {
        id: user.user.id,
        email: user.user.email,
        username: user.user.username,
        displayName: user.user.display_name,
        isActive: user.user.is_active,
        emailVerified: user.user.email_verified,
        organization: user.user.organization,
        userRoles: user.user.user_roles,
        avatar: user.user.avatar,
      },
      accessToken: user.access_token,
    };
  }
}
