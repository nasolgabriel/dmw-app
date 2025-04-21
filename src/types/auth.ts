export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  role: string;
  message: string;
  access_token: string;
  user: {
    name: string;
  };
  errors?: {
    username?: string[];
    password?: string[];
  };
  counter: {
    division: string;
  };
}
