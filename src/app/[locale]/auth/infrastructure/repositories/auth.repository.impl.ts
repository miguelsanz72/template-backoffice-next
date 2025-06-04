import { AuthRepository } from '../../domain';
import { ApiRestDataSource } from '../datasources/api.rest.datasource';
import { IUserLogin, IValidateAccount, ISocialLoginRequest } from '../../domain/interfaces';
import { ILoginResponse } from '../../domain/interfaces';
import { IUserRegister } from '../../domain/interfaces';
import { IForgotPassword } from '../../domain/interfaces';
import { IChangePassword } from '../../domain/interfaces';
import { IResponseMessage } from '@/core';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private dataSource: ApiRestDataSource) {
    this.dataSource = dataSource;
  }

  async login(user: IUserLogin): Promise<ILoginResponse> {
    return this.dataSource.login(user);
  }

  async socialLogin(data: ISocialLoginRequest): Promise<ILoginResponse> {
    return this.dataSource.socialLogin(data);
  }

  async register(user: IUserRegister): Promise<IResponseMessage> {
    return this.dataSource.register(user);
  }

  async forgotPassword(data: IForgotPassword): Promise<IResponseMessage> {
    return this.dataSource.forgotPassword(data);
  }

  async resetPassword(data: IChangePassword): Promise<IResponseMessage> {
    return this.dataSource.resetPassword(data);
  }

  async resendActivationCode(email: string): Promise<IResponseMessage> {
    return this.dataSource.resendActivationCode(email);
  }

  async validateAccount(data: IValidateAccount): Promise<IResponseMessage> {
    return this.dataSource.validateAccount(data);
  }
}
