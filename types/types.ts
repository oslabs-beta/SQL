export type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

export interface UserRecord {
  id?: string;
  username: string,
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  created_at?: Date
}