export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
