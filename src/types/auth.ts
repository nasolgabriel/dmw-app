export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  role: string;
  message: string;
  access_token: string;
  counter_id: number;
  user: {
    name: string;
    counter_id: number;
  };
  errors?: {
    username?: string[];
    password?: string[];
  };
  counter: {
    division: string;
  };
}
