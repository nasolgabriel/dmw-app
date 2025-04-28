export interface currentClientResponse {
  client: {
    id: number;
    firstname: string;
    middlename: string;
    lastname: string;
    suffix: string | null;
    age: number;
    birthday: string;
    sex: string;
    contact: string;
    address: string;
    email: string;
    passport_number: string;
    purpose: string;
    priority: boolean;
    status: string;
  };
  ticket_number: string;
}
