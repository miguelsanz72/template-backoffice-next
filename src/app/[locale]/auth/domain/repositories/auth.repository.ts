import { IResponseMessage } from '@/core';
import { IUserLogin, IUserRegister, ISocialLoginRequest } from '../interfaces';
import { ILoginResponse } from '../interfaces';
import { IForgotPassword } from '../interfaces';
import { IChangePassword } from '../interfaces';
import { IValidateAccount } from '../interfaces';

export abstract class AuthRepository {
  abstract login(user: IUserLogin): Promise<ILoginResponse>;
  abstract socialLogin(data: ISocialLoginRequest): Promise<ILoginResponse>;
  abstract register(user: IUserRegister): Promise<IResponseMessage>;
  abstract forgotPassword(data: IForgotPassword): Promise<IResponseMessage>;
  abstract resetPassword(data: IChangePassword): Promise<IResponseMessage>;
  abstract resendActivationCode(email: string): Promise<IResponseMessage>;
  abstract validateAccount(data: IValidateAccount): Promise<IResponseMessage>;
}
