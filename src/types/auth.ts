export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CurrentClientResponse {
  id: number;
  client_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  ticket_number: string;
  counter_id: number;
  called_at: string;
  client: {
    id: number;
    firstname: string;
    middlename: string;
    lastname: string;
    contact: string;
    purpose: string;
    priority: boolean;
    age: number;
    birthday: string;
    sex: string;
    status: string;
    passport_number: string;
    email: string;
    address: string;
    created_at: string;
    updated_at: string;
  };
}

export interface LoginResponse {
  role: string;
  message: string;
  access_token: string;
  errors?: {
    username?: string[];
    password?: string[];
  };
  user: {
    counter_id: string;
    window_title: string;
    name: string;
  };
}
