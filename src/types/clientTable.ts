export interface ClientTable {
  id: string | number;
  ticket_number: string;
  name: string;
  time: string;
  priority?: boolean;
}