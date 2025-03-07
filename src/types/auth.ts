export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token?: string;
  errors?: {
    username?: string[];
    password?: string[];
  };
}
