import { AuthRepository } from '../../domain';
import { IResendActivationCode, IUserLogin, IValidateAccount, ISocialLoginRequest } from '../../domain/interfaces';
import { ILoginResponse } from '../../domain/interfaces';
import { IUserRegister } from '../../domain/interfaces';
import { IForgotPassword } from '../../domain/interfaces';
import { IChangePassword } from '../../domain/interfaces';
import { IResponseMessage } from '@/core';
import { httpClient } from '@/core/network';
import { RegisterRequestDto } from '../dtos';
import { ForgotPasswordDto } from '../dtos';
import { ChangePasswordDto } from '../dtos';
import { AuthMapper } from '../mappers';
import { ILoginResponseDto } from '../dtos/login.dto';
import { generateStrongPassword } from '@/lib/utils';

export class ApiRestDataSource implements AuthRepository {
  constructor() {}

  async login(user: IUserLogin): Promise<ILoginResponse> {
    try {
      const authHeader = this._generateAuthHeader(user);
      const response = await httpClient.post<IUserLogin, ILoginResponseDto>('/auth/signin', user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      });

      return AuthMapper.toLoginResponseDto(response.data);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async socialLogin(data: ISocialLoginRequest): Promise<ILoginResponse> {
    try {
      const prepareData: IUserLogin = {
        email: data.email,
        password: generateStrongPassword(),
        network: data.network,
        socialToken: data.socialToken,
      };
      const authHeader = this._generateAuthHeader(prepareData);
      const response = await httpClient.post<IUserLogin, ILoginResponseDto>('/auth/signin', prepareData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      });

      return AuthMapper.toLoginResponseDto(response.data);
    } catch (error) {
      console.error('Error during social login:', error);
      throw error;
    }
  }

  async register(user: IUserRegister): Promise<IResponseMessage> {
    const registerDto: RegisterRequestDto = AuthMapper.toRegisterDto(user);

    const response = await httpClient.post<RegisterRequestDto, IResponseMessage>('/auth/register', registerDto, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async forgotPassword(data: IForgotPassword): Promise<IResponseMessage> {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: data.email,
    };

    const response = await httpClient.post<ForgotPasswordDto, IResponseMessage>('/auth/recovery-code', forgotPasswordDto, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async resetPassword(data: IChangePassword): Promise<IResponseMessage> {
    const changePasswordDto: ChangePasswordDto = {
      email: data.email,
      code: data.code,
      password: data.password,
    };

    const response = await httpClient.post<ChangePasswordDto, IResponseMessage>('/auth/reset-password', changePasswordDto, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async resendActivationCode(email: string): Promise<IResponseMessage> {
    const response = await httpClient.post<IResendActivationCode, IResponseMessage>(
      '/auth/resend-activation-code',
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  async validateAccount(data: IValidateAccount): Promise<IResponseMessage> {
    const response = await httpClient.post<IValidateAccount, IResponseMessage>('/auth/activate-account', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  private _generateAuthHeader(user: IUserLogin): string {
    const { email, password, network, socialToken } = user;
    return `Basic ${btoa(network && socialToken ? `${email}:${password}:${network}:${socialToken}` : `${email}:${password}`)}`;
  }
}
