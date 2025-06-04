export interface ILoginResponseDto {
  user: IUserDto;
  access_token: string;
}

export interface IUserDto {
  id: string;
  email: string;
  username: string;
  display_name: string;
  is_active: boolean;
  email_verified: boolean;
  organization: null;
  user_roles: string[];
  avatar: {
    url: string | null;
    charter: string;
    color: string;
  };
  auth_method: string;
}
