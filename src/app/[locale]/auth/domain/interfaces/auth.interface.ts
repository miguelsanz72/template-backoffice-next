import { ESignInMethod } from '../enums';

export interface IUserLogin {
  email: string;
  password: string;
  network?: ESignInMethod;
  socialToken?: string;
}

export interface IUserRegister {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IChangePassword {
  email: string;
  code: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  isActive: boolean;
  emailVerified: boolean;
  organization: null;
  userRoles: string[];
  avatar: {
    url: string | null;
    charter: string;
    color: string;
  };
}

export interface IValidateAccount {
  email: string;
  code: string;
}

export interface IResendActivationCode {
  email: string;
}
